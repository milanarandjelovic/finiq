import type { Type } from '@nestjs/common'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

const valid2xxStatusCodes = [
  HttpStatus.OK,
  HttpStatus.CREATED,
  HttpStatus.ACCEPTED,
  HttpStatus.NON_AUTHORITATIVE_INFORMATION,
  HttpStatus.NO_CONTENT,
  HttpStatus.RESET_CONTENT,
  HttpStatus.PARTIAL_CONTENT,
]

export const ApiRestfulResponse = <TModel extends Type<any>>({
  model,
  status,
  description,
}: {
  model: TModel | TModel[]
  status: number
  description: string
}) => {
  if (Array.isArray(model) && !valid2xxStatusCodes.includes(status)) {
    return applyDecorators(
      ApiExtraModels(...model),
      ApiResponse({
        status,
        description,
        content: {
          'application/json': {
            schema: {
              oneOf: model.map((modelItem) => ({
                type: 'object',
                title: modelItem.name,
                properties: {
                  statusCode: {
                    type: 'number',
                    example: status,
                  },
                  message: {
                    type: 'string',
                    example: description,
                  },
                  errors: {
                    type: 'array',
                    items: {
                      $ref: getSchemaPath(modelItem),
                    },
                  },
                },
              })),
            },
          },
        },
      }),
    )
  } else if (!Array.isArray(model)) {
    return applyDecorators(
      ApiExtraModels(model),
      ApiResponse({
        status,
        description,
        content: {
          'application/json': {
            schema: {
              properties: {
                statusCode: {
                  type: 'number',
                  example: status,
                },
                message: {
                  type: 'string',
                  example: description,
                },
                ...(valid2xxStatusCodes.includes(status)
                  ? {
                      data: {
                        type: 'object',
                        $ref: getSchemaPath(model),
                      },
                    }
                  : {
                      errors: {
                        type: 'array',
                        $ref: getSchemaPath(model),
                      },
                    }),
              },
            },
          },
        },
      }),
    )
  }
}
