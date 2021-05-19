import { ClassConstructor } from 'class-transformer';

interface VueDecorator {
  (target: any, key: string): void;
  (target: any, key: string, index: number): void;
}
export function SerialiseData <T> (classType: ClassConstructor<T>): VueDecorator
