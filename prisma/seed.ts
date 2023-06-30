import { OperationType } from "@/core/entities/Operation";
import User, { UserStatus } from "@/core/entities/User";
import PrismaOperationsRepository from "@/infrastructure/database/PrismaOperationsRepository";
import PrismaUsersRepository from "@/infrastructure/database/PrismaUsersRepository";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const userRepository = new PrismaUsersRepository(prisma);
  const operationRepository = new PrismaOperationsRepository(prisma);

  const user = new User({
    balance: 200,
    email: "test@test",
    status: UserStatus.ACTIVE,
  });
  await user.setPassword("test123");

  const user2 = new User({
    balance: 2000,
    email: "test2@test",
    status: UserStatus.ACTIVE,
  });
  await user2.setPassword("test1234");

  await Promise.all([
    userRepository.create(user),
    userRepository.create(user2),
    operationRepository.create({
      cost: 20.5,
      type: OperationType.ADDITION,
    }),
    operationRepository.create({
      cost: 10.0,
      type: OperationType.SUBTRACTION,
    }),
    operationRepository.create({
      cost: 100.0,
      type: OperationType.SQUARE_ROOT,
    }),
    operationRepository.create({
      cost: 1.35,
      type: OperationType.RANDOM_STRING,
    }),
    operationRepository.create({
      cost: 15.37,
      type: OperationType.DIVISION,
    }),
    operationRepository.create({
      cost: 23.8,
      type: OperationType.MULTIPLICATION,
    }),
    operationRepository.create({
      cost: 48.33,
      type: OperationType.RANDOM_STRING_V2,
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
