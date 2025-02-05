import type { IncomingMessage, ServerResponse } from "http";
import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import { createRouter } from "next-connect";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/styles.module.css";
import { getUsers, randomId, saveUsers } from "../../utils/api";
import type { User } from "../../utils/common";
import { validateUser } from "../../utils/common";

interface PageProps {
  users?: User[];
  error?: string;
}

const UsersPage: NextPage<PageProps> = ({ users, error }) => {
  if (error) return <ErrorPage statusCode={400} title={error} />;
  return (
    <div className={styles.container}>
      <Head>
        <title>getServerSideProps Example</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://github.com/hoangvvo/next-connect/tree/main/examples/nextjs/pages/gssp-users/index.tsx">
            getServerSideProps
          </a>{" "}
          Example
        </h1>
        <p style={{ textAlign: "center", lineHeight: 1.5 }}>
          Server-rendered app using{" "}
          <a
            href="https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props"
            style={{ color: "#0070f3" }}
          >
            getServerSideProps
          </a>{" "}
          built with next-connect.
          <br />
          This page works just fine{" "}
          <a
            href="https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/javascript/disable"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0070f3" }}
          >
            without JavaScript
          </a>
          !
        </p>
        <div>
          <h2 style={{ textAlign: "center" }}>All users</h2>
          <div className={styles.grid}>
            {users?.length ? (
              users.map((user) => (
                <Link href={`/gssp-users/${user.id}`} key={user.id}>
                  <a className={styles.card}>
                    <h2>{user.name}</h2>
                    <p>{user.age}</p>
                  </a>
                </Link>
              ))
            ) : (
              <p>No users</p>
            )}
          </div>
        </div>
        <div>
          <form className={styles.form} method="POST">
            <h2>Create users</h2>
            <label className={styles.label} htmlFor="name">
              What&apos;s your name?
            </label>
            <input name="name" id="name" className={styles.input} required />
            <label className={styles.label} htmlFor="age">
              How old are you?
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              name="age"
              id="age"
              className={styles.input}
              required
            />
            <button className={styles.button} type="submit">
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UsersPage;

const gsspRouter = createRouter<
  IncomingMessage & { body?: Record<string, string> },
  ServerResponse
>()
  .get((req): GetServerSidePropsResult<PageProps> => {
    const users = getUsers(req);
    return { props: { users } };
  })
  .post(
    async (req, res, next) => {
      // a middleware to parse application/x-www-form-urlencoded
      req.body = await new Promise((resolve, reject) => {
        let body = "";
        req.on("error", reject);
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          const searchParams = new URLSearchParams(body);
          const result: Record<string, string> = {};
          for (const [key, value] of searchParams) {
            result[key] = value;
          }
          resolve(result);
        });
      });
      return next();
    },
    (req, res): GetServerSidePropsResult<PageProps> => {
      const users = getUsers(req);
      // parse number
      const newUser = {
        id: randomId(),
        ...req.body,
        age: Number(req.body?.age),
      } as User;
      validateUser(newUser);
      users.push(newUser);
      saveUsers(res, users);
      return {
        redirect: {
          destination: "/gssp-users",
          // https://stackoverflow.com/questions/37337412/should-i-use-a-301-302-or-303-redirect-after-form-submission
          statusCode: 303,
        },
      };
    }
  )
  .all(() => {
    // this will be called if method is not GET or POST
    return {
      notFound: true,
      props: {},
    };
  });

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
}) => {
  try {
    // need await so that error can be caught below
    return (await gsspRouter.run(
      req,
      res
    )) as GetServerSidePropsResult<PageProps>;
  } catch (e) {
    return {
      props: {
        error: (e as Error).message,
      },
    };
  }
};
