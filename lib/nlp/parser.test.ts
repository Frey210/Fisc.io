import { parseTransactionText } from './parser';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

// Test Suite
console.log('Running parser tests...');

const t1 = parseTransactionText('50000 makan di Golqi Chicken');
assert(t1?.type === 'EXPENSE', 't1 type should be EXPENSE');
assert(t1?.amount === 50000, 't1 amount should be 50000');
assert(t1?.categoryHint === 'F&B', 't1 category should be F&B');

const t2 = parseTransactionText('+8000000 gaji bulan ini');
assert(t2?.type === 'INCOME', 't2 type should be INCOME');
assert(t2?.amount === 8000000, 't2 amount should be 8000000');
assert(t2?.categoryHint === 'Salary', 't2 category should be Salary');

const t3 = parseTransactionText('> 1000000 dana darurat');
assert(t3?.type === 'TRANSFER', 't3 type should be TRANSFER');
assert(t3?.amount === 1000000, 't3 amount should be 1000000');
assert(t3?.categoryHint === 'Emergency Fund', 't3 category should be Emergency Fund');

const t4 = parseTransactionText('kopi padu rasa 25k');
assert(t4?.type === 'EXPENSE', 't4 type should be EXPENSE');
assert(t4?.amount === 25000, 't4 amount should be 25000');
assert(t4?.categoryHint === 'F&B', 't4 category should be F&B');

const t5 = parseTransactionText('1.5jt bayar sewa server hosting');
assert(t5?.type === 'EXPENSE', 't5 type should be EXPENSE');
assert(t5?.amount === 1500000, 't5 amount should be 1500000');
assert(t5?.categoryHint === 'Hosting & Tech', 't5 category should be Hosting & Tech');

console.log('All parser tests passed successfully!');
