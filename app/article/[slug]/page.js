import { Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import {
  getDatabase, getBlocks, getPageFromSlug,
} from '../../../lib/notion';
import Text from '../../../components/text';
import { renderBlock } from '../../../components/notion/renderer';
import styles from '../../../styles/post.module.css';

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const database = await getDatabase();
  // すべてのページのスラッグを取得して返す
  return database.map((page) => {
    const slug = page.properties.Slug?.formula?.string;
    return { slug }; // 動的パラメータとしてスラッグを設定
  });
}

export default async function Page({ params }) {
  const { slug } = params; // スラッグを取得
  const page = await getPageFromSlug(slug); // スラッグに基づいてページデータを取得
  const blocks = await getBlocks(page?.id); // ページIDに基づいてブロックデータを取得

  if (!page || !blocks) {
    return <div>Page not found</div>; // ページやブロックが取得できない場合は「Page not found」を表示
  }

  return (
    <div>
      <Head>
        <title>{page.properties.Title?.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className={styles.container}>
        <h1 className={styles.name}>
          <Text title={page.properties.Title?.title} />
        </h1>
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
          <Link href="/" className={styles.back}>
            ← Go home
          </Link>
        </section>
      </article>
    </div>
  );
}
