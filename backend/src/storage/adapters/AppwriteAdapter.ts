import { Client, Databases, ID, Query } from 'node-appwrite';
import { StorageAdapter } from '../StorageAdapter.js';
import { getEnv } from '../../utils/env.js';

export class AppwriteAdapter<T extends { id: string }> implements StorageAdapter<T> {
  private collectionId: string;
  private databaseId: string;
  private client: Client;
  private databases: Databases;

  constructor(collectionName: string) {
    const env = getEnv();
    this.client = new Client()
      .setEndpoint(env.APPWRITE_ENDPOINT!)
      .setProject(env.APPWRITE_PROJECT_ID!)
      .setKey(env.APPWRITE_API_KEY!);

    this.databases = new Databases(this.client);
    this.databaseId = env.APPWRITE_DATABASE_ID!;

    // Fallback simple mapping, preferably collectionName maps exactly to collectionId
    this.collectionId = collectionName;
  }

  async getAll(): Promise<T[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.limit(100)]
      );
      return response.documents.map(doc => {
        const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...rest } = doc;
        return { id: $id, ...rest } as unknown as T;
      });
    } catch (error) {
      console.error(`Appwrite getAll failed for ${this.collectionId}:`, error);
      return [];
    }
  }

  async getById(id: string): Promise<T | undefined> {
    try {
      const doc = await this.databases.getDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...rest } = doc;
      return { id: $id, ...rest } as unknown as T;
    } catch (error: any) {
      if (error?.code !== 404) {
         console.error(`Appwrite getById failed for ${this.collectionId}:`, error);
      }
      return undefined;
    }
  }

  async insert(item: T): Promise<T> {
    try {
      const { id, ...data } = item;
      const doc = await this.databases.createDocument(
        this.databaseId,
        this.collectionId,
        id || ID.unique(),
        data
      );
      const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...rest } = doc;
      return { id: $id, ...rest } as unknown as T;
    } catch (error) {
       console.error(`Appwrite insert failed for ${this.collectionId}:`, error);
       throw error;
    }
  }

  async update(id: string, updates: Partial<T>): Promise<T | undefined> {
    try {
       // Omit id from updates if present
       const cleanUpdates = { ...updates };
       delete cleanUpdates.id;

       const doc = await this.databases.updateDocument(
         this.databaseId,
         this.collectionId,
         id,
         cleanUpdates
       );
       const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...rest } = doc;
       return { id: $id, ...rest } as unknown as T;
    } catch (error) {
      console.error(`Appwrite update failed for ${this.collectionId}:`, error);
      return undefined;
    }
  }

  async delete(id: string): Promise<boolean> {
     try {
       await this.databases.deleteDocument(
         this.databaseId,
         this.collectionId,
         id
       );
       return true;
     } catch (error) {
       console.error(`Appwrite delete failed for ${this.collectionId}:`, error);
       return false;
     }
  }
}
