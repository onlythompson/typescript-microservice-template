import { container } from 'tsyringe';

//External services
// In your dependency injection setup (e.g., src/infrastructure/di/container.ts)
import { IFileStorageService } from './infrastructure/external-services/contracts/IFileStorageService';
import { S3FileStorageService } from './infrastructure/external-services/implementations/S3FileStorageService';
import { GCSFileStorageService } from './infrastructure/external-services/implementations/GCFileStorageService';
import { ConfluentCloudEngine } from './infrastructure/messaging/kafka/ConfluentCloudEngine';

// Choose which implementation to use
container.registerSingleton<IFileStorageService>('IFileStorageService', S3FileStorageService);
// Or, to use Google Cloud Storage:
// container.registerSingleton<IFileStorageService>('IFileStorageService', GCSFileStorageService);

 // Register ConfluentCloudEngine as a singleton
 container.register<ConfluentCloudEngine>(ConfluentCloudEngine, {
    useFactory: (c) => ConfluentCloudEngine.getInstance()
  });
  
// Register repositories
// container.registerSingleton<UserRepository>('UserRepository', MongoUserRepository);


// Register services
// container.registerSingleton<UserService>(UserService);


// Register use cases


// Register controllers


// container.register<IEventHandler>("IEventHandler", TaskEventHandler);

export { container };