import * as fs from 'node:fs'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { TransactionType } from '@finiq/shared'
import { Category } from '@/modules/category/entities/category.entity'
import { TransactionQueryBuilder } from '@/modules/transaction/builders/transaction-query.builder'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'
import { TransactionService } from '@/modules/transaction/services/transaction.service'

jest.mock('node:fs', () => ({
  ...jest.requireActual('node:fs'),
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}))

describe('TransactionService', () => {
  let service: TransactionService
  let transactionRepository: jest.Mocked<Repository<Transaction>>
  let categoryRepository: jest.Mocked<Repository<Category>>

  const mockQueryBuilder: any = {
    findAll: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    applyFilters: jest.fn(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TransactionQueryBuilder,
          useValue: mockQueryBuilder,
        },
        {
          provide: I18nService,
          useValue: { t: jest.fn().mockReturnValue('translated') },
        },
      ],
    }).compile()

    service = module.get<TransactionService>(TransactionService)
    transactionRepository = module.get(getRepositoryToken(Transaction))
    categoryRepository = module.get(getRepositoryToken(Category))
  })

  describe('findAll', () => {
    it('should return paginated transactions', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[{ id: 'tx-1' }], 1])
      const result = await service.findAll(
        { currentPage: 1, perPage: 10 } as any,
        'user-1',
      )

      expect(result.message).toBe('Successfully returned all transactions.')
    })
  })

  describe('findOne', () => {
    it('should return transaction when found', async () => {
      const tx = { id: 'tx-1', amount: 100 }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      const result = await service.findOne('tx-1', 'user-1')

      expect(result.message).toBe('Successfully returned transaction.')
      expect(result.data.transaction).toEqual(tx)
    })

    it('should throw when transaction not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(service.findOne('missing', 'user-1')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('should throw when expense has no category', async () => {
      await expect(
        service.create(
          {
            type: TransactionType.EXPENSE,
            amount: 100,
            date: '2026-01-01',
          } as any,
          'user-1',
        ),
      ).rejects.toThrow()
    })

    it('should throw when category not found for expense', async () => {
      categoryRepository.findOne.mockResolvedValue(null)

      await expect(
        service.create(
          {
            type: TransactionType.EXPENSE,
            amount: 100,
            date: '2026-01-01',
            categoryId: 'cat-1',
          } as any,
          'user-1',
        ),
      ).rejects.toThrow()
    })

    it('should create income transaction without category', async () => {
      const savedTx = { id: 'tx-1', amount: 500 }
      jest.mocked(transactionRepository.create).mockReturnValue({
        save: jest.fn().mockResolvedValue(savedTx),
      })
      const result = await service.create(
        {
          type: TransactionType.INCOME,
          amount: 500,
          date: '2026-01-01',
        } as any,
        'user-1',
      )

      expect(result.message).toBe('Transaction created successfully.')
    })

    it('should create expense transaction with category', async () => {
      const category = { id: 'cat-1', name: 'Food' }
      categoryRepository.findOne.mockResolvedValue(category as any)
      const savedTx = { id: 'tx-1', amount: 100, category }
      jest.mocked(transactionRepository.create).mockReturnValue({
        save: jest.fn().mockResolvedValue(savedTx),
      })
      const result = await service.create(
        {
          type: TransactionType.EXPENSE,
          amount: 100,
          date: '2026-01-01',
          categoryId: 'cat-1',
          note: 'Lunch',
        } as any,
        'user-1',
      )

      expect(result.message).toBe('Transaction created successfully.')
    })

    it('should create transaction with null note when note is not provided', async () => {
      const savedTx = { id: 'tx-1', amount: 200 }
      jest.mocked(transactionRepository.create).mockReturnValue({
        save: jest.fn().mockResolvedValue(savedTx),
      })
      const result = await service.create(
        {
          type: TransactionType.INCOME,
          amount: 200,
          date: '2026-01-01',
        } as any,
        'user-1',
      )

      expect(result.message).toBe('Transaction created successfully.')
    })
  })

  describe('update', () => {
    it('should throw when transaction not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(
        service.update('missing', {} as any, 'user-1'),
      ).rejects.toThrow()
    })

    it('should update amount, date, and note', async () => {
      const tx: any = {
        id: 'tx-1',
        amount: 100,
        date: new Date(),
        note: null,
        category: null,
      }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      const result = await service.update(
        'tx-1',
        { amount: 200, date: '2026-06-01', note: 'Updated note' } as any,
        'user-1',
      )

      expect(result.message).toBe('Transaction updated successfully.')
      expect(tx.amount).toBe(200)
      expect(tx.note).toBe('Updated note')
    })

    it('should set note to null when note is explicitly null', async () => {
      const tx: any = {
        id: 'tx-1',
        amount: 100,
        date: new Date(),
        note: 'old note',
        category: null,
      }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      await service.update('tx-1', { note: null } as any, 'user-1')

      expect(tx.note).toBeNull()
    })

    it('should set category to null when categoryId is null', async () => {
      const tx: any = { id: 'tx-1', amount: 100, category: { id: 'cat-1' } }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      await service.update('tx-1', { categoryId: null } as any, 'user-1')

      expect(tx.category).toBeNull()
    })

    it('should throw when categoryId is provided but category not found', async () => {
      const tx: any = { id: 'tx-1', amount: 100, category: null }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      categoryRepository.findOne.mockResolvedValue(null)

      await expect(
        service.update('tx-1', { categoryId: 'nonexistent' } as any, 'user-1'),
      ).rejects.toThrow()
    })

    it('should update category when categoryId is provided and found', async () => {
      const tx: any = { id: 'tx-1', amount: 100, category: null }
      const category = { id: 'cat-1', name: 'Food' }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      categoryRepository.findOne.mockResolvedValue(category as any)
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      await service.update('tx-1', { categoryId: 'cat-1' } as any, 'user-1')

      expect(tx.category).toEqual(category)
    })

    it('should not update fields when they are undefined', async () => {
      const tx: any = {
        id: 'tx-1',
        amount: 100,
        date: new Date('2026-01-01'),
        note: 'old',
        category: null,
      }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      const result = await service.update('tx-1', {} as any, 'user-1')

      expect(result.message).toBe('Transaction updated successfully.')
      expect(tx.amount).toBe(100)
      expect(tx.note).toBe('old')
    })
  })

  describe('delete', () => {
    it('should throw when transaction not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(service.delete('missing', 'user-1')).rejects.toThrow()
    })

    it('should delete transaction without receipt', async () => {
      const tx: any = { id: 'tx-1', receiptPath: null }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(transactionRepository.remove).mockResolvedValue(tx)
      const result = await service.delete('tx-1', 'user-1')

      expect(result.message).toBe('Transaction deleted successfully.')
      expect(fs.existsSync).not.toHaveBeenCalled()
    })

    it('should delete receipt file when it exists', async () => {
      const tx: any = { id: 'tx-1', receiptPath: 'receipt.jpg' }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(fs.existsSync).mockReturnValue(true)
      jest.mocked(fs.unlinkSync).mockImplementation(() => {})
      jest.mocked(transactionRepository.remove).mockResolvedValue(tx)
      const result = await service.delete('tx-1', 'user-1')

      expect(fs.unlinkSync).toHaveBeenCalled()
      expect(result.message).toBe('Transaction deleted successfully.')
    })

    it('should skip unlinkSync when receipt file does not exist on disk', async () => {
      const tx: any = { id: 'tx-1', receiptPath: 'missing.jpg' }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(fs.existsSync).mockReturnValue(false)
      jest.mocked(fs.unlinkSync).mockImplementation(() => {})
      jest.mocked(transactionRepository.remove).mockResolvedValue(tx)
      await service.delete('tx-1', 'user-1')

      expect(fs.unlinkSync).not.toHaveBeenCalled()
    })
  })

  describe('uploadReceipt', () => {
    it('should throw when transaction not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(
        service.uploadReceipt(
          'missing',
          { buffer: Buffer.from(''), originalname: 'r.jpg' } as any,
          'user-1',
        ),
      ).rejects.toThrow()
    })

    it('should upload receipt and return transaction', async () => {
      const tx: any = { id: 'tx-1', receiptPath: null }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(fs.mkdirSync).mockImplementation(() => undefined)
      jest.mocked(fs.writeFileSync).mockImplementation(() => {})
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      const result = await service.uploadReceipt(
        'tx-1',
        { buffer: Buffer.from('data'), originalname: 'receipt.jpg' } as any,
        'user-1',
      )

      expect(result.message).toBe('Receipt uploaded successfully.')
      expect(tx.receiptPath).toBeTruthy()
    })

    it('should delete old receipt file when one exists', async () => {
      const tx: any = { id: 'tx-1', receiptPath: 'old-receipt.jpg' }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(fs.existsSync).mockReturnValue(true)
      jest.mocked(fs.unlinkSync).mockImplementation(() => {})
      jest.mocked(fs.mkdirSync).mockImplementation(() => undefined)
      jest.mocked(fs.writeFileSync).mockImplementation(() => {})
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      await service.uploadReceipt(
        'tx-1',
        { buffer: Buffer.from('data'), originalname: 'new.jpg' } as any,
        'user-1',
      )

      expect(fs.unlinkSync).toHaveBeenCalled()
    })

    it('should skip unlinkSync for old receipt when file does not exist on disk', async () => {
      const tx: any = { id: 'tx-1', receiptPath: 'old-receipt.jpg' }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(fs.existsSync).mockReturnValue(false)
      jest.mocked(fs.unlinkSync).mockImplementation(() => {})
      jest.mocked(fs.mkdirSync).mockImplementation(() => undefined)
      jest.mocked(fs.writeFileSync).mockImplementation(() => {})
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      await service.uploadReceipt(
        'tx-1',
        { buffer: Buffer.from('data'), originalname: 'new.jpg' } as any,
        'user-1',
      )

      expect(fs.unlinkSync).not.toHaveBeenCalled()
    })
  })

  describe('deleteReceipt', () => {
    it('should throw when transaction not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(service.deleteReceipt('missing', 'user-1')).rejects.toThrow()
    })

    it('should throw when transaction has no receipt', async () => {
      mockQueryBuilder.getOne.mockResolvedValue({
        id: 'tx-1',
        receiptPath: null,
      })

      await expect(service.deleteReceipt('tx-1', 'user-1')).rejects.toThrow()
    })

    it('should delete receipt and return transaction', async () => {
      const tx: any = { id: 'tx-1', receiptPath: 'receipt.jpg' }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(fs.existsSync).mockReturnValue(true)
      jest.mocked(fs.unlinkSync).mockImplementation(() => {})
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      const result = await service.deleteReceipt('tx-1', 'user-1')

      expect(fs.unlinkSync).toHaveBeenCalled()
      expect(tx.receiptPath).toBeNull()
      expect(result.message).toBe('Receipt deleted successfully.')
    })

    it('should skip unlinkSync when receipt file does not exist on disk', async () => {
      const tx: any = { id: 'tx-1', receiptPath: 'receipt.jpg' }
      mockQueryBuilder.getOne.mockResolvedValue(tx)
      jest.mocked(fs.existsSync).mockReturnValue(false)
      jest.mocked(fs.unlinkSync).mockImplementation(() => {})
      jest.mocked(transactionRepository.save).mockResolvedValue(tx)
      await service.deleteReceipt('tx-1', 'user-1')

      expect(fs.unlinkSync).not.toHaveBeenCalled()
    })
  })

  describe('getReceiptFilePath', () => {
    it('should throw when transaction not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null)

      await expect(
        service.getReceiptFilePath('missing', 'user-1'),
      ).rejects.toThrow()
    })

    it('should throw when transaction has no receipt', async () => {
      mockQueryBuilder.getOne.mockResolvedValue({
        id: 'tx-1',
        receiptPath: null,
      })

      await expect(
        service.getReceiptFilePath('tx-1', 'user-1'),
      ).rejects.toThrow()
    })

    it('should throw when receipt file does not exist on disk', async () => {
      mockQueryBuilder.getOne.mockResolvedValue({
        id: 'tx-1',
        receiptPath: 'missing.jpg',
      })
      jest.mocked(fs.existsSync).mockReturnValue(false)

      await expect(
        service.getReceiptFilePath('tx-1', 'user-1'),
      ).rejects.toThrow()
    })

    it('should return file path when receipt exists', async () => {
      mockQueryBuilder.getOne.mockResolvedValue({
        id: 'tx-1',
        receiptPath: 'receipt.jpg',
      })
      jest.mocked(fs.existsSync).mockReturnValue(true)
      const result = await service.getReceiptFilePath('tx-1', 'user-1')

      expect(result).toContain('receipt.jpg')
    })
  })
})
