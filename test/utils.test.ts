import { formatAlias, constructPactFile } from '../src/utils'
import { expect } from '@jest/globals'
import { XHRRequestAndResponse } from '../src/types'

describe('formatAlias', () => {
  it('should format array of string in alias format', () => {
    expect(formatAlias(['a', 'b'])).toEqual(['@a', '@b'])
  })

  it('should format single string to a formatted array', () => {
    expect(formatAlias('a')).toEqual(['@a'])
  })
})

describe('constructPactFile', () => {
  it('should append intercept to the existing content', () => {
    const existingContent = {
      consumer: {
        name: 'ui-consumer'
      },
      provider: {
        name: 'todo-api'
      },
      interactions: [
        {
          description: 'shows todo',
          providerState: '',
          request: {
            method: 'GET',
            path: '/api/todo',
            body: '',
            query: ''
          },
          response: {
            status: 200,
            headers: {
              'access-control-allow-origin': '*',
              'content-type': 'application/json',
              'access-control-expose-headers': '*',
              'access-control-allow-credentials': 'true'
            },
            body: [
              {
                content: 'clean desk'
              },
              {
                content: 'make coffee'
              }
            ]
          }
        }
      ],
      metadata: {
        pactSpecification: {
          version: '2.0.0'
        }
      }
    }
    const newIntercept = {
      request: {
        method: 'POST',
        url: 'https://localhost:3000/create',
        body: 'hello'
      },
      response: {
        statusCode: 201,
        statusText: 'Created'
      }
    } as XHRRequestAndResponse
    const result = constructPactFile(
      newIntercept,
      'create todo',
      {
        consumerName: 'ui-consumer',
        providerName: 'todo-api'
      },
      existingContent
    )
    expect(result.interactions.length).toBe(2)
    expect(result.interactions[1].description).toBe('create todo')
  })

  it('should create a new file when no pact file is found', () => {
    const newIntercept = {
      request: {
        method: 'POST',
        url: 'https://localhost:3000/create',
        body: 'hello'
      },
      response: {
        statusCode: 201,
        statusText: 'Created'
      }
    } as XHRRequestAndResponse
    const result = constructPactFile(newIntercept, 'create todo', {
      consumerName: 'ui-consumer',
      providerName: 'todo-api'
    })
    expect(result.consumer.name).toBe('ui-consumer')
    expect(result.provider.name).toBe('todo-api')
    expect(result.interactions.length).toBe(1)
  })
})