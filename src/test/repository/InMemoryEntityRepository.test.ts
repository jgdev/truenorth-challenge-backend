import createInMemoryRepository, {
  ITestEntityRepository,
} from "../utils/InMemoryRepository";

describe("InMemoryEntityRepository", () => {
  test("should create an entry", () => {
    const expectedResult = {
      now: Date.now(),
    };
    const repository: ITestEntityRepository<any> = createInMemoryRepository();
    expect(repository.records.length).toBe(0);
    repository.create(expectedResult);
    expect(repository.records).toMatchObject([expectedResult]);
  });

  test("should find an entry", async () => {
    const initialData: any[] = [{ a: 1 }, { a: 2, b: 3 }, { a: 5, b: 4 }];
    const repository: ITestEntityRepository<any> =
      createInMemoryRepository(initialData);
    expect(repository.records).toMatchObject(initialData);
    const result = await repository.findOne({ a: 2 });
    expect(result).toMatchObject(initialData[1]);
  });

  test("should find entries paginated", async () => {
    const initialData: any[] = new Array(10)
      .fill(null)
      .map((_, index) => ({ index: index + 1 }));

    initialData[0].b = true;
    initialData[8].b = true;

    const repository: ITestEntityRepository<any> =
      createInMemoryRepository(initialData);
    expect(repository.records).toMatchObject(initialData);
    const result = await repository.findAll(
      {},
      {
        limit: 2,
        skip: 2,
      }
    );
    expect(result.total).toBe(10);
    expect(result.result).toMatchObject([{ index: 3 }, { index: 4 }]);
    expect(result.limit).toBe(2);
    expect(result.skip).toBe(2);

    const result2 = await repository.findAll({
      b: true,
    });
    expect(result2.total).toBe(2);
    expect(result2.result).toMatchObject([
      { index: 1, b: true },
      { index: 9, b: true },
    ]);
  });

  test("should sort items paginated", async () => {
    const initialData = [
      { name: "c", age: 84 },
      { name: "d", age: 27 },
      { name: "a", age: 52 },
      { name: "b", age: 37 },
    ];
    const repository: ITestEntityRepository<{ name: string; age: number }> =
      createInMemoryRepository(initialData);

    const result1 = await repository.findAll(
      {},
      { sortBy: "name", orderBy: "asc" }
    );
    expect(result1.result).toMatchObject([
      { name: "a" },
      { name: "b" },
      { name: "c" },
      { name: "d" },
    ]);
    expect(result1).toMatchObject({
      sortBy: "name",
      orderBy: "asc",
    });

    const result2 = await repository.findAll(
      {},
      {
        sortBy: "name",
        orderBy: "desc",
      }
    );

    expect(result2.result).toMatchObject([
      { name: "d" },
      { name: "c" },
      { name: "b" },
      { name: "a" },
    ]);
    expect(result2).toMatchObject({
      sortBy: "name",
      orderBy: "desc",
    });

    const result3 = await repository.findAll(
      {},
      {
        sortBy: "age",
        orderBy: "asc",
      }
    );
    expect(result3.result).toMatchObject([
      { age: 27 },
      { age: 37 },
      { age: 52 },
      { age: 84 },
    ]);
    expect(result3).toMatchObject({
      sortBy: "age",
      orderBy: "asc",
    });

    const result4 = await repository.findAll(
      {},
      {
        sortBy: "age",
        orderBy: "desc",
      }
    );
    expect(result4.result).toMatchObject([
      { age: 84 },
      { age: 52 },
      { age: 37 },
      { age: 27 },
    ]);
    expect(result4).toMatchObject({
      sortBy: "age",
      orderBy: "desc",
    });
  });

  test("should update an entry", async () => {
    const initialData: any[] = [{ a: 1 }, { a: 2, b: 3 }, { a: 5, b: 4 }];
    const repository: ITestEntityRepository<any> =
      createInMemoryRepository(initialData);
    expect(repository.records[0].b).toBe(undefined);
    const expectedResult = await repository.update({ a: 1 }, { b: true });
    expect(repository.records[0].b).toBe(true);
    expect(expectedResult).toMatchObject({ a: 1, b: true });
  });

  test("shoudl remove an entry", async () => {
    const initialData: any[] = [{ a: 1 }, { a: 2, b: 3 }, { a: 5, b: 4 }];
    const repository: ITestEntityRepository<any> =
      createInMemoryRepository(initialData);
    expect(repository.records[0]).toMatchObject({ a: 1 });
    await repository.remove({ a: 1 });
    expect(repository.records[0]).toMatchObject({ a: 2, b: 3 });
  });
});
