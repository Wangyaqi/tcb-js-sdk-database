import { DB } from "../typings"

// =============== Realtime Snapshot / Change Event (Public) ====================

interface ISnapshotConstructorOptions {
  id: number
  docChanges: DB.ISingleDBEvent[]
  docs: Record<string, any>[]
  type?: DB.SnapshotType
  // EJSON: any
  msgType?: String
}

export class Snapshot implements DB.ISnapshot {
  id!: number
  docChanges!: DB.ISingleDBEvent[]
  docs!: Record<string, any>[]
  type?: "init"
  // EJSON: any

  constructor(options: ISnapshotConstructorOptions) {
    const { id, docChanges, docs, msgType, type } = options

    let cachedDocChanges: DB.ISingleDBEvent[]
    let cachedDocs: Record<string, any>[]

    Object.defineProperties(this, {
      id: {
        get: () => id,
        enumerable: true
      },
      docChanges: {
        get: () => {
          if (!cachedDocChanges) {
            cachedDocChanges = JSON.parse(JSON.stringify(docChanges))
          }
          return cachedDocChanges
        },
        enumerable: true
      },
      docs: {
        get: () => {
          if (!cachedDocs) {
            cachedDocs = JSON.parse(JSON.stringify(docs))
          }
          return cachedDocs
        },
        enumerable: true
      },
      msgType: {
        get: () => msgType,
        enumerable: true
      },
      type: {
        get: () => type,
        enumerable: true
      }
    })
  }
}
