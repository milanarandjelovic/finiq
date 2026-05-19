import { act, renderHook } from '@testing-library/react'

import { useMonthNavigation } from './use-month-navigation'

describe('useMonthNavigation', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2026, 4, 19)) // May 19, 2026
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('initial state', () => {
    it('should initialize year to the current year', () => {
      const { result } = renderHook(() => useMonthNavigation())

      expect(result.current.year).toBe(2026)
    })

    it('should initialize month to the current month (1-indexed)', () => {
      const { result } = renderHook(() => useMonthNavigation())

      expect(result.current.month).toBe(5)
    })

    it('should initialize date to the 1st of the current month', () => {
      const { result } = renderHook(() => useMonthNavigation())

      expect(result.current.date.getDate()).toBe(1)
      expect(result.current.date.getMonth()).toBe(4) // 0-indexed
      expect(result.current.date.getFullYear()).toBe(2026)
    })
  })

  describe('prevMonth', () => {
    it('should decrement the month by one', () => {
      const { result } = renderHook(() => useMonthNavigation())

      act(() => result.current.prevMonth())

      expect(result.current.month).toBe(4)
      expect(result.current.year).toBe(2026)
    })

    it('should roll back to December of the previous year from January', () => {
      jest.setSystemTime(new Date(2026, 0, 15))
      const { result } = renderHook(() => useMonthNavigation())

      act(() => result.current.prevMonth())

      expect(result.current.month).toBe(12)
      expect(result.current.year).toBe(2025)
    })

    it('should keep the date on the 1st after navigating back', () => {
      const { result } = renderHook(() => useMonthNavigation())

      act(() => result.current.prevMonth())

      expect(result.current.date.getDate()).toBe(1)
    })
  })

  describe('nextMonth', () => {
    it('should increment the month by one', () => {
      const { result } = renderHook(() => useMonthNavigation())

      act(() => result.current.nextMonth())

      expect(result.current.month).toBe(6)
      expect(result.current.year).toBe(2026)
    })

    it('should roll forward to January of the next year from December', () => {
      jest.setSystemTime(new Date(2026, 11, 15))
      const { result } = renderHook(() => useMonthNavigation())

      act(() => result.current.nextMonth())

      expect(result.current.month).toBe(1)
      expect(result.current.year).toBe(2027)
    })

    it('should keep the date on the 1st after navigating forward', () => {
      const { result } = renderHook(() => useMonthNavigation())

      act(() => result.current.nextMonth())

      expect(result.current.date.getDate()).toBe(1)
    })
  })

  describe('setDate', () => {
    it('should update year and month when called directly', () => {
      const { result } = renderHook(() => useMonthNavigation())

      act(() => result.current.setDate(new Date(2027, 2, 1)))

      expect(result.current.year).toBe(2027)
      expect(result.current.month).toBe(3)
    })
  })
})
