import { prisma } from "@/lib/prisma";
import { THEMES } from "@/lib/constants";
import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

fs.writeFileSync(
  path.join(process.cwd(), "prisma", "themes.json"),
  JSON.stringify(THEMES, null, 2),
  "utf8"
);

const contentTypes = [
  "title",
  "heading1",
  "heading2",
  "heading3",
  "blank",
  "imageAndText",
  "table",
  "blockquote",
  "numberedList",
  "bulletedList",
  "calloutBox",
  "todoList",
  "codeBlock",
  "link",
  "divider",
  "customButton",
  "tableOfContents",
];

function genContent(type: string) {
  const id = faker.string.uuid();

  switch (type) {
    case "title":
    case "heading1":
    case "heading2":
    case "heading3":
      return {
        id,
        type,
        name: "Heading",
        content: faker.company.catchPhrase(),
      };

    case "blank":
      return { id, type, name: "Blank", content: "" };

    case "imageAndText":
      return {
        id,
        type,
        name: "Image Block",
        content: {
          image: faker.image.urlPicsumPhotos(),
          text: faker.lorem.sentences(2),
        },
      };

    case "table":
      return {
        id,
        type,
        name: "Table",
        content: [
          ["Metric", "Value"],
          ["Users", faker.number.int({ min: 1000, max: 40000 }).toString()],
          ["Revenue", faker.finance.amount()],
        ],
      };

    case "blockquote":
      return { id, type, name: "Quote", content: faker.lorem.sentence() };

    case "numberedList":
    case "bulletedList":
      return {
        id,
        type,
        name: "List",
        content: [faker.lorem.words(3), faker.lorem.words(3)],
      };

    case "calloutBox":
      return {
        id,
        type,
        name: "Callout",
        content: faker.lorem.sentence(),
        callOutType: faker.helpers.arrayElement([
          "success",
          "warning",
          "info",
          "question",
          "caution",
        ]),
      };

    case "todoList":
      return {
        id,
        type,
        name: "Todo List",
        content: [
          { checked: false, text: faker.lorem.words(3) },
          { checked: true, text: faker.lorem.words(2) },
        ],
      };

    case "codeBlock":
      return {
        id,
        type,
        name: "Code Block",
        code: `console.log("Hello ${faker.word.noun()}")`,
        language: "javascript",
      };

    case "link":
      return {
        id,
        type,
        name: "Link",
        content: faker.internet.url(),
        link: faker.internet.url(),
      };

    case "divider":
      return { id, type, name: "Divider", content: "---" };

    case "customButton":
      return {
        id,
        type,
        name: "Button",
        content: "Click Me",
        bgColor: "#6366f1",
      };

    case "tableOfContents":
      return {
        id,
        type,
        name: "TOC",
        content: ["Intro", "Main Content", "Conclusion"],
      };

    default:
      return { id, type, name: type, content: "" };
  }
}

function genSlides() {
  const count = faker.number.int({ min: 3, max: 10 });

  return Array.from({ length: count }).map((_, idx) => {
    const type = faker.helpers.arrayElement(contentTypes);

    return {
      id: faker.string.uuid(),
      slideName: `${type} Slide`,
      slideOrder: idx + 1,
      type,
      content: genContent(type),
    };
  });
}

async function main() {
  console.log("🌱 Seeding...");

  // const user1 = await prisma.user.upsert({
  //   where: { id: realUser.id },
  //   update: {},
  //   create: {
  //     id: realUser.id,
  //     name: realUser.name,
  //     email: realUser.email,
  //     clerkId: realUser.clerkId,
  //     profileImage: realUser.profileImage,
  //     subscription: realUser.subscription,
  //   },
  // });

  console.log("👤 Real user added.");

  const user2 = await prisma.user.upsert({
    where: { email: "testuser@example.com" },
    update: {},
    create: {
      name: faker.person.fullName(),
      email: "testuser@example.com",
      clerkId: faker.string.uuid(),
      profileImage: faker.image.avatar(),
      subscription: false,
    },
  });

  console.log("🧪 Test user added.");

  // const bothUsers = [user1, user2];
  const bothUsers = [user2];

  console.log("📁 Creating 100 projects...");

  for (let i = 0; i < 100; i++) {
    const owner = faker.helpers.arrayElement(bothUsers);

    await prisma.project.create({
      data: {
        title: `${faker.company.catchPhrase()} — Demo ${i + 1}`,
        slides: genSlides(),
        outlines: ["Intro", "Main", "Summary"],
        thumbnail: faker.image.urlPicsumPhotos(),
        theme: faker.helpers.arrayElement(THEMES).name,
        isSellable: faker.datatype.boolean(),
        isFavorite: faker.datatype.boolean(),
        isDeleted: false,
        ownerId: owner.id,
      },
    });

    if ((i + 1) % 10 === 0) {
      console.log(`  ➕ ${i + 1} projects created...`);
    }
  }

  console.log("🎉 PROJECT SEED COMPLETE");
}

main()
  .catch(async (err) => {
    console.error("Seed error", err);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
