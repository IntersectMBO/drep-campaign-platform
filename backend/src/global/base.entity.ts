import { IsBoolean, IsDateString, IsOptional } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * Abstract base class for dynamically assigning properties.
 */
export abstract class Model {
	constructor(input?: any) {
		if (input) {
			// Iterate over the key-value pairs in the input object
			for (const [key, value] of Object.entries(input)) {
				// Assign the value to the corresponding property in this instance
				(this as any)[key] = value;
			}
		}
	}
}

/**
 * Base entity class with soft-delete functionality.
 * All entities that extend this class will have soft-delete capability.
 */
export abstract class SoftDeletableBaseEntity extends Model {
	@IsOptional()
	@IsDateString()
	// Soft delete column that records the date/time when the entity was soft-deleted
	@DeleteDateColumn() // Indicates that this column is used for soft-delete
	deletedAt?: Date;
}




/**
 * Abstract base entity with common fields for primary key, creation, update timestamps, soft-delete, and more.
 */
export abstract class BaseEntity extends SoftDeletableBaseEntity  {
	// Primary key of UUID type
	@PrimaryGeneratedColumn()
	id?: number;

	@CreateDateColumn({
		update:false
	}) // TypeORM decorator for creation date
	createdAt?: Date;

	@UpdateDateColumn() // TypeORM decorator for update date
	updateAt?: Date;
}