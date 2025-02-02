import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixClassStudents1738453144245 implements MigrationInterface {
    name = 'FixClassStudents1738453144245';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP CONSTRAINT "FK_e2ff8f73d11b5d40f705df15a26"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP CONSTRAINT "FK_d4f0cd35573415960ac36a6f5e5"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_d4f0cd35573415960ac36a6f5e"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_e2ff8f73d11b5d40f705df15a2"`,
        );
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP CONSTRAINT "PK_34e0edd49a1ef521d79216cb953"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD CONSTRAINT "PK_d4f0cd35573415960ac36a6f5e5" PRIMARY KEY ("schoolMembersId")`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP COLUMN "classesId"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP CONSTRAINT "PK_d4f0cd35573415960ac36a6f5e5"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP COLUMN "schoolMembersId"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD CONSTRAINT "PK_f1ef7a4fd2eabf7ef3c6bc7cae3" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD "classId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD "schoolMemberId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "schools"
            ALTER COLUMN "location" TYPE geometry(Point)`);
        await queryRunner.query(`ALTER TABLE "users"
            ALTER COLUMN "dateOfBirth" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD CONSTRAINT "FK_8077e3550bf215749c0cdd138c2" FOREIGN KEY ("classId") REFERENCES "classes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD CONSTRAINT "FK_4740a6daa8ebbbbb529d1ef6c36" FOREIGN KEY ("schoolMemberId") REFERENCES "school_members" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP CONSTRAINT "FK_4740a6daa8ebbbbb529d1ef6c36"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP CONSTRAINT "FK_8077e3550bf215749c0cdd138c2"`);
        await queryRunner.query(`ALTER TABLE "users"
            ALTER COLUMN "dateOfBirth" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "schools"
            ALTER COLUMN "location" TYPE geometry(POINT, 0)`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            ALTER COLUMN "location" TYPE geometry(GEOMETRY, 0)`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP COLUMN "schoolMemberId"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP COLUMN "classId"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP CONSTRAINT "PK_f1ef7a4fd2eabf7ef3c6bc7cae3"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD "schoolMembersId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD CONSTRAINT "PK_d4f0cd35573415960ac36a6f5e5" PRIMARY KEY ("schoolMembersId")`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD "classesId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_students"
            DROP CONSTRAINT "PK_d4f0cd35573415960ac36a6f5e5"`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD CONSTRAINT "PK_34e0edd49a1ef521d79216cb953" PRIMARY KEY ("classesId", "schoolMembersId")`);
        await queryRunner.query(
            `CREATE INDEX "IDX_e2ff8f73d11b5d40f705df15a2" ON "class_students" ("classesId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_d4f0cd35573415960ac36a6f5e" ON "class_students" ("schoolMembersId") `,
        );
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD CONSTRAINT "FK_d4f0cd35573415960ac36a6f5e5" FOREIGN KEY ("schoolMembersId") REFERENCES "school_members" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_students"
            ADD CONSTRAINT "FK_e2ff8f73d11b5d40f705df15a26" FOREIGN KEY ("classesId") REFERENCES "classes" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
}
