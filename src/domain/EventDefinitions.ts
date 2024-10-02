export enum TaskEventDefinition{
    TASK_REGISTERED = 'TASK.registered',
    TASK_UPDATED = 'TASK.updated',
    TASK_DELETED = 'TASK.deleted',
    MATCH_REQUEST = 'match.request',
    MATCH_REQUEST_ACCEPTED = 'match.request.accepted',
}

// Schema definition (consider moving this to a separate file or service)
export const EventSchemaDefinition = {
    type: 'record',
    name: '',
    fields: [
      { name: 'eventId', type: 'string' },
      { name: 'eventType', type: 'string' },
      { name: 'aggregateId', type: 'string' },
      { name: 'aggregateType', type: 'string' },
      { name: 'timestamp', type: { type: 'long', logicalType: 'timestamp-millis' } },
      { name: 'version', type: 'int' },
      { name: 'payload', type: 'map' } // Simplified for this example
    ]
  };