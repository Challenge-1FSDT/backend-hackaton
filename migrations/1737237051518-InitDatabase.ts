import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1737237051518 implements MigrationInterface {
    name = 'InitDatabase1737237051518';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles"
                             (
                                 "id"        SERIAL            NOT NULL,
                                 "title"     character varying NOT NULL,
                                 "post"      character varying NOT NULL,
                                 "createdAt" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updatedAt" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "authorId"  integer,
                                 CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id")
                             )`);
        await queryRunner.query(`CREATE TABLE "classrooms"
                             (
                                 "id"             SERIAL                 NOT NULL,
                                 "name"           character varying(200) NOT NULL,
                                 "location"       geometry,
                                 "locationRadius" integer,
                                 "createdAt"      TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updatedAt"      TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deletedAt"      TIMESTAMP,
                                 "schoolId"       integer,
                                 CONSTRAINT "PK_20b7b82896c06eda27548bd0c24" PRIMARY KEY ("id")
                             )`);
        await queryRunner.query(`CREATE TABLE "schools"
                             (
                                 "id"             SERIAL                 NOT NULL,
                                 "name"           character varying(200) NOT NULL,
                                 "fantasyName"    character varying(200) NOT NULL,
                                 "taxId"          character varying(14)  NOT NULL,
                                 "address"        character varying(200) NOT NULL,
                                 "city"           character varying(200) NOT NULL,
                                 "state"          character varying(2)   NOT NULL,
                                 "location"       geometry               NOT NULL,
                                 "locationRadius" integer                NOT NULL DEFAULT '50',
                                 "createdAt"      TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updatedAt"      TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deletedAt"      TIMESTAMP,
                                 CONSTRAINT "taxId" UNIQUE ("taxId"),
                                 CONSTRAINT "PK_95b932e47ac129dd8e23a0db548" PRIMARY KEY ("id")
                             )`);
        await queryRunner.query(`CREATE TABLE "attendances"
                             (
                                 "id"        SERIAL    NOT NULL,
                                 "startAt"   TIMESTAMP,
                                 "endAt"     TIMESTAMP,
                                 "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                                 "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                                 "deletedAt" TIMESTAMP,
                                 "schoolId"  integer,
                                 "lectureId" integer,
                                 "studentId" integer,
                                 CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id")
                             )`);
        await queryRunner.query(`CREATE TABLE "subjects"
                             (
                                 "id"          SERIAL                 NOT NULL,
                                 "name"        character varying(200) NOT NULL,
                                 "description" character varying(2000),
                                 "createdAt"   TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updatedAt"   TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deletedAt"   TIMESTAMP,
                                 "schoolId"    integer,
                                 CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id")
                             )`);
        await queryRunner.query(`CREATE TABLE "lectures"
                             (
                                 "id"          SERIAL                 NOT NULL,
                                 "name"        character varying(200) NOT NULL,
                                 "startAt"     TIMESTAMP              NOT NULL,
                                 "endAt"       TIMESTAMP              NOT NULL,
                                 "createdAt"   TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updatedAt"   TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deletedAt"   TIMESTAMP,
                                 "schoolId"    integer,
                                 "subjectId"   integer,
                                 "classId"     integer,
                                 "classroomId" integer,
                                 CONSTRAINT "PK_0fbf04287eb4e401af19caf7677" PRIMARY KEY ("id")
                             )`);
        await queryRunner.query(`CREATE TABLE "classes"
                             (
                                 "id"        SERIAL                 NOT NULL,
                                 "name"      character varying(200) NOT NULL,
                                 "startAt"   TIMESTAMP              NOT NULL,
                                 "endAt"     TIMESTAMP              NOT NULL,
                                 "createdAt" TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updatedAt" TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deletedAt" TIMESTAMP,
                                 "schoolId"  integer,
                                 CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id")
                             )`);
        await queryRunner.query(`CREATE TABLE "school_members"
                             (
                                 "id"        SERIAL            NOT NULL,
                                 "roles"     character varying NOT NULL DEFAULT 'STUDENT',
                                 "createdAt" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updatedAt" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "deletedAt" TIMESTAMP,
                                 "schoolId"  integer,
                                 "userId"    integer,
                                 CONSTRAINT "PK_c5ceb8c907a77f9d3556cfb2399" PRIMARY KEY ("id")
                             )`);
        await queryRunner.query(`CREATE TABLE "users"
                             (
                                 "id"         SERIAL                 NOT NULL,
                                 "firstName"  character varying(200) NOT NULL,
                                 "lastName"   character varying(200),
                                 "email"      character varying(200) NOT NULL,
                                 "phone"      character varying(200),
                                 "taxId"      character varying(11),
                                 "password"   character varying      NOT NULL,
                                 "role"       character varying      NOT NULL DEFAULT 'USER',
                                 "isDisabled" boolean                NOT NULL DEFAULT false,
                                 "createdAt"  TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updatedAt"  TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deletedAt"  TIMESTAMP,
                                 CONSTRAINT "email" UNIQUE ("email"),
                                 CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                             )`);
        await queryRunner.query(`CREATE TABLE "subject_teachers"
                             (
                                 "subjectsId"      integer NOT NULL,
                                 "schoolMembersId" integer NOT NULL,
                                 CONSTRAINT "PK_0e62cb869ca1ab55bece9acc59e" PRIMARY KEY ("subjectsId", "schoolMembersId")
                             )`);
        await queryRunner.query(
            `CREATE INDEX "IDX_02fbf0a593253d6360c2998c51" ON "subject_teachers" ("subjectsId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_74011f8490d13c92ee9bb9c013" ON "subject_teachers" ("schoolMembersId") `,
        );
        await queryRunner.query(`CREATE TABLE "class_students"
                             (
                                 "classesId"       integer NOT NULL,
                                 "schoolMembersId" integer NOT NULL,
                                 CONSTRAINT "PK_34e0edd49a1ef521d79216cb953" PRIMARY KEY ("classesId", "schoolMembersId")
                             )`);
        await queryRunner.query(
            `CREATE INDEX "IDX_e2ff8f73d11b5d40f705df15a2" ON "class_students" ("classesId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_d4f0cd35573415960ac36a6f5e" ON "class_students" ("schoolMembersId") `,
        );
        await queryRunner.query(`ALTER TABLE "articles"
        ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classrooms"
        ADD CONSTRAINT "FK_55418280a71e7e220d89987ed8f" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances"
        ADD CONSTRAINT "FK_d9f8577055ff735bdd0497cf1bf" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances"
        ADD CONSTRAINT "FK_128c07658f1120749ff53fb74b1" FOREIGN KEY ("lectureId") REFERENCES "lectures" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances"
        ADD CONSTRAINT "FK_615b414059091a9a8ea0355ae89" FOREIGN KEY ("studentId") REFERENCES "school_members" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subjects"
        ADD CONSTRAINT "FK_e97a33660b98bffe49e2431bb8c" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
        ADD CONSTRAINT "FK_b4515b36735a4987d26d23988db" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
        ADD CONSTRAINT "FK_f36b84a9e320363b2ca60afea6d" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
        ADD CONSTRAINT "FK_9fc4f6bfe04d0329f0d3390ea22" FOREIGN KEY ("classId") REFERENCES "classes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
        ADD CONSTRAINT "FK_8653bdb0d6f5ad1ba96384c3525" FOREIGN KEY ("classroomId") REFERENCES "classrooms" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classes"
        ADD CONSTRAINT "FK_17d36b6f6a79669ba76b671ac72" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "school_members"
        ADD CONSTRAINT "FK_b0e4d2a88605debd91e304a2186" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "school_members"
        ADD CONSTRAINT "FK_dd0a51c83634654157043bb4bdf" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subject_teachers"
        ADD CONSTRAINT "FK_02fbf0a593253d6360c2998c517" FOREIGN KEY ("subjectsId") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subject_teachers"
        ADD CONSTRAINT "FK_74011f8490d13c92ee9bb9c0138" FOREIGN KEY ("schoolMembersId") REFERENCES "school_members" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_students"
        ADD CONSTRAINT "FK_e2ff8f73d11b5d40f705df15a26" FOREIGN KEY ("classesId") REFERENCES "classes" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "class_students"
        ADD CONSTRAINT "FK_d4f0cd35573415960ac36a6f5e5" FOREIGN KEY ("schoolMembersId") REFERENCES "school_members" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_students"
        DROP CONSTRAINT "FK_d4f0cd35573415960ac36a6f5e5"`);
        await queryRunner.query(`ALTER TABLE "class_students"
        DROP CONSTRAINT "FK_e2ff8f73d11b5d40f705df15a26"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers"
        DROP CONSTRAINT "FK_74011f8490d13c92ee9bb9c0138"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers"
        DROP CONSTRAINT "FK_02fbf0a593253d6360c2998c517"`);
        await queryRunner.query(`ALTER TABLE "school_members"
        DROP CONSTRAINT "FK_dd0a51c83634654157043bb4bdf"`);
        await queryRunner.query(`ALTER TABLE "school_members"
        DROP CONSTRAINT "FK_b0e4d2a88605debd91e304a2186"`);
        await queryRunner.query(`ALTER TABLE "classes"
        DROP CONSTRAINT "FK_17d36b6f6a79669ba76b671ac72"`);
        await queryRunner.query(`ALTER TABLE "lectures"
        DROP CONSTRAINT "FK_8653bdb0d6f5ad1ba96384c3525"`);
        await queryRunner.query(`ALTER TABLE "lectures"
        DROP CONSTRAINT "FK_9fc4f6bfe04d0329f0d3390ea22"`);
        await queryRunner.query(`ALTER TABLE "lectures"
        DROP CONSTRAINT "FK_f36b84a9e320363b2ca60afea6d"`);
        await queryRunner.query(`ALTER TABLE "lectures"
        DROP CONSTRAINT "FK_b4515b36735a4987d26d23988db"`);
        await queryRunner.query(`ALTER TABLE "subjects"
        DROP CONSTRAINT "FK_e97a33660b98bffe49e2431bb8c"`);
        await queryRunner.query(`ALTER TABLE "attendances"
        DROP CONSTRAINT "FK_615b414059091a9a8ea0355ae89"`);
        await queryRunner.query(`ALTER TABLE "attendances"
        DROP CONSTRAINT "FK_128c07658f1120749ff53fb74b1"`);
        await queryRunner.query(`ALTER TABLE "attendances"
        DROP CONSTRAINT "FK_d9f8577055ff735bdd0497cf1bf"`);
        await queryRunner.query(`ALTER TABLE "classrooms"
        DROP CONSTRAINT "FK_55418280a71e7e220d89987ed8f"`);
        await queryRunner.query(`ALTER TABLE "articles"
        DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_d4f0cd35573415960ac36a6f5e"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_e2ff8f73d11b5d40f705df15a2"`,
        );
        await queryRunner.query(`DROP TABLE "class_students"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_74011f8490d13c92ee9bb9c013"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_02fbf0a593253d6360c2998c51"`,
        );
        await queryRunner.query(`DROP TABLE "subject_teachers"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "school_members"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TABLE "lectures"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP TABLE "attendances"`);
        await queryRunner.query(`DROP TABLE "schools"`);
        await queryRunner.query(`DROP TABLE "classrooms"`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }
}
