export class CircularRingBuffer {
  private buffer: Float64Array;
  private head = 0;
  private count = 0;
  readonly capacity: number;

  constructor(capacity = 1000) {
    this.capacity = capacity;
    this.buffer = new Float64Array(capacity);
  }

  push(value: number): void {
    this.buffer[this.head] = value;
    this.head = (this.head + 1) % this.capacity;
    if (this.count < this.capacity) this.count++;
  }

  toArray(): number[] {
    const arr: number[] = new Array(this.count);
    if (this.count < this.capacity) {
      for (let i = 0; i < this.count; i++) arr[i] = this.buffer[i];
    } else {
      for (let i = 0; i < this.capacity; i++) {
        arr[i] = this.buffer[(this.head + i) % this.capacity];
      }
    }
    return arr;
  }

  size(): number {
    return this.count;
  }
}
