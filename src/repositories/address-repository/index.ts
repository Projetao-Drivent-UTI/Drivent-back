import { prisma } from "@/config";
import { Address, PrismaPromise } from "@prisma/client";
import { CreateEnrollmentParams, UpdateEnrollmentParams } from "../enrollment-repository";
async function upsert(enrollmentId: number, createdAddress: CreateAddressParams, updatedAddress: UpdateAddressParams) {
  return prisma.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      ...createdAddress,
      Enrollment: { connect: { id: enrollmentId } },
    },
    update: updatedAddress,
  });
}

export type CreateAddressParams = Omit<Address, "id" | "createdAt" | "updatedAt" | "enrollmentId">;
export type UpdateAddressParams = CreateAddressParams;

async function adressAndEnrollmentUpsert(
  userId: number, 
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return await prisma.$transaction(async (tx) => {
    let createdAddress: CreateAddressParams;
    let updatedAddress: UpdateAddressParams;
    
    const enrollment = await tx.enrollment.upsert({
      where: {
        userId,
      },
      create: createdEnrollment,
      update: updatedEnrollment,
    });
    
    const enrollmentId = enrollment.id;
    
    tx.address.upsert({
      where: {
        enrollmentId,
      },
      create: {
        ...createdAddress,
        Enrollment: { connect: { id: enrollmentId } },
      },
      update: updatedAddress,
    });
  });
}

const addressRepository = {
  upsert,
  adressAndEnrollmentUpsert
};

export default addressRepository;
