import { createStateful } from '../index';
import { getScope } from '../methods';

describe('Проверка функционала', () => {
  test('должен отдавать примитивные данные', (done) => {
    const target = { name: 'Ravil', date: new Date(), hi: () => console.log('hi'), age: 24 };
    const store = createStateful(target);

    expect(store.name).toEqual(target.name);
    expect(store.date).toEqual(target.date);
    expect(store.hi).toEqual(target.hi);
    expect(store.age).toEqual(target.age);

    done();
  });

  test('должен записывать примитивные данные', (done) => {
    const target: { name?: string; date?: Date; hi?: () => void; age?: number } = {};
    const store = createStateful(target);

    store.name = 'Ravil';
    store.date = new Date();
    store.hi = () => console.log('hi');
    store.age = 24;

    expect(store.name).toEqual(target.name);
    expect(store.date).toEqual(target.date);
    expect(store.hi).toEqual(target.hi);
    expect(store.age).toEqual(target.age);

    done();
  });

  test('должен знать какие примитивные поля считывались в промежуток времени', (done) => {
    const target = { name: 'Ravil', date: new Date(), hi: () => console.log('hi'), age: 24 };
    const store = createStateful(target);
    const scope = getScope(store);

    expect(scope).not.toBeNull();

    const id = 'test';

    expect(scope.getRecordProps(id)).toEqual([]);

    scope.cleanRecord(id);
    scope.startRecord(id);

    const name = store.name;
    const age = store.age;

    expect(scope.getRecordProps(id)).toEqual([['name'], ['age']]);
    const date = store.date;
    scope.stopRecord(id);
    expect(scope.getRecordProps(id)).toEqual([['name'], ['age'], ['date']]);

    scope.cleanRecord(id);
    expect(scope.getRecordProps(id)).toEqual([]);

    done();
  });

  test('должен прослушивать изменения примитивных полей', (done) => {
    const target = { name: 'Ravil', date: new Date(), hi: () => console.log('hi'), age: 24 };
    const store = createStateful(target);
    const scope = getScope(store);

    expect(scope).not.toBeNull();

    scope.listenChange((props, oldValue, newValue) => {
      expect(props).toEqual(['name']);
      expect(oldValue).toEqual('Ravil');
      expect(newValue).toEqual('Azat');
      done();
    });
    store.name = 'Azat';
  }, 1000);

  test('должен прослушивать изменения конкретных примитивных полей', (done) => {
    const target = { name: 'Ravil', date: new Date(), hi: () => console.log('hi'), age: 24 };
    const store = createStateful(target);
    const scope = getScope(store);

    expect(scope).not.toBeNull();

    scope.listenChangeProps([['name']], () => {
      throw new Error('dont emit');
    });
    scope.listenChangeProps([['age']], (props, oldValue, newValue) => {
      expect(props).toEqual(['age']);
      expect(oldValue).toEqual(24);
      expect(newValue).toEqual(25);
      setTimeout(() => done(), 500);
    });
    store.age = 25;
  }, 1000);

  test('должен выполнить реакцию', (done) => {
    const target = { name: 'Ravil', date: new Date(), hi: () => console.log('hi'), age: 24 };
    const store = createStateful(target);
    const scope = getScope(store);

    expect(scope).not.toBeNull();

    scope.reaction(
      () => ({ name: store.name, age: store.age }),
      ({ oldResult: oldValue, newResult: newValue }) => {
        expect(oldValue.age).toEqual(24);
        expect(newValue.age).toEqual(25);
        expect(oldValue.name).toEqual('Ravil');
        expect(newValue.name).toEqual('Ravil');
        setTimeout(() => done(), 500);
      },
    );
    store.age = 25;
  }, 1000);

  test('test weakmap', () => {
    let a = {};
    const b = { a };
    const c = () => console.log('hey');

    const weakMap = new WeakMap();
    weakMap.set(a, true);
    weakMap.set(c, 'func');

    a = null;
    console.log(weakMap.get(a));
    console.log(weakMap.get(b.a));
    console.log(weakMap.get(c));
  });
});
