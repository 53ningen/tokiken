import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Title from '@/components/commons/Title'
import { Metadata } from 'next'
import Link from 'next/link'

export const generateMetadata = async (): Promise<Metadata> => {
  const title = 'プライバシーポリシー'
  const description = undefined
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary',
    },
  }
}

export default function Home() {
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: 'プライバシーポリシー', href: '/privacy' }]} />
      <Title title="プライバシーポリシー" />
      <div className="px-0 sm:px-8 text-left text-xs text-gray-500">
        <div>
          <div className="grid gap-6">
            <div>
              超ときめき♡研究部（以下、「当サイト」と言います。）では、お客様からお預かりする個人情報の重要性を強く認識しており、個人情報の保護に関する法律、その他の関係法令を遵守すると共に、以下に定めるプライバシーポリシーに従って、個人情報を安全かつ適切に取り扱うことを宣言します。
            </div>
            <div className="text-lg font-bold pt-2">1. 個人情報の定義</div>
            <div>
              本プライバシーポリシーにおいて、個人情報とは生存する個人に関する情報であり、氏名、生年月日、住所、電話番号、メールアドレスなど、特定の個人を識別することができるものをいいます。
            </div>
            <div className="text-lg font-bold pt-2">2. 個人情報の管理</div>
            <div>
              お客様からお預かりした個人情報は、不正アクセス、紛失、漏えいなどが起こらないよう、慎重かつ適切に管理します。
            </div>
            <div className="text-lg font-bold pt-2">3. 個人情報の利用目的</div>
            <div>
              当サイトでは、お客様からのお問い合わせなどを通じて、お客様の氏名、メールアドレスなどの個人情報をご提供いただく場合があります。その場合は、以下に示す利用目的のために、適正に利用するものと致します。
            </div>
            <ul>
              <li>お問い合わせに対する回答</li>
              <li>お申し込みいただいたサービスなどの提供</li>
              <li>アンケート、ご意見、ご感想の依頼</li>
              <li>当サイトを改善するために必要な分析などを行うため</li>
              <li>新サービス・新商品の開発を行うために必要な分析などを行うため</li>
              <li>
                個人情報を含まない形でデータを集計し、当サイト、及びお客様の参考資料を作成するため
              </li>
            </ul>
            <div className="text-lg font-bold pt-2">4. 個人情報の第三者提供</div>
            <div>
              お客様からお預かりした個人情報を、個人情報保護法その他の法令に基づき開示が認められる場合を除き、お客様ご本人の同意を得ずに第三者に提供することはありません。
            </div>
            <div className="text-lg font-bold pt-2">
              5. 個人情報の開示・訂正・削除について
            </div>
            <div>
              お客様からお預かりした個人情報の確認、訂正・削除などをご希望の場合、お客様ご本人が当サイトのお問い合わせフォームよりお申し出ください。
              適切な本人確認を行った後、速やかに対応いたします。
            </div>
            <div className="text-lg font-bold pt-2">6. アクセス解析ツールについて</div>
            <div>
              当サイトは、Googleが提供するアクセス解析ツール「Googleアナリティクス」を利用しています。Googleアナリティクスは、Cookieを使用することでお客様のトラフィックデータを収集しています。
              お客様はブラウザの設定でCookieを無効にすることで、トラフィックデータの収集を拒否することができます。
              なお、トラフィックデータからお客様個人を特定することはできません。詳しくは「
              <Link href="https://marketingplatform.google.com/about/analytics/terms/jp/">
                Googleアナリティクス利用規約
              </Link>
              」をご確認ください。
            </div>
            <div className="text-lg font-bold pt-2">7. Cookie（クッキー）について</div>
            <div>
              Cookie（クッキー）とは、お客様のサイト閲覧履歴を、お客様のコンピュータにデータとして保存しておく仕組みです。
              なお、Cookieに含まれる情報は当サイトや他サイトへのアクセスに関する情報のみであり、氏名、住所、メール
              アドレス、電話番号などの個人情報は含まれません。
              従って、Cookieに保存されている情報からお客様個人を特定することはできません。
            </div>
            <div className="text-lg font-bold pt-2">8. 広告の配信について</div>
            <div className="grid gap-4">
              <div>
                当サイトでは、第三者配信の広告サービスを利用しています。
                広告配信事業者は、お客様の過去のアクセス情報に基づいて、適切な広告を配信する場合があります。
              </div>
              <div className="text-md">Amazonアソシエイトについて</div>
              <div>
                当サイトは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
              </div>
            </div>
            <div className="text-lg font-bold pt-2">9. 免責事項</div>
            <div>
              当サイトに掲載されている情報・資料の内容については、万全の注意を払って掲載しておりますが、掲載された情報の正確性を何ら保証するものではありません。従いまして、当サイトに掲載された情報・資料を利用、使用、ダウンロードするなどの行為に起因して生じる結果に対し、一切の責任を負いません。
              なお、当サイトに掲載された情報の正確性を鑑みた際に、予告なしで情報の変更・削除を行う場合がございますので、予めご了承ください。
              アフィリエイトプログラムについて
              当サイトは、アフィリエイトプログラムにより商品を紹介しております。
              アフィリエイトプログラムとは、商品及びサービスの提供元と業務提携を締結し、商品やサービスを紹介するインターネット上のシステムです。
              当サイトで紹介している商品・サービスは、当サイトが直接的に販売している訳ではありません。従いまして、当サイトで紹介している商品・サービスに関するお問い合わせ、購入手続き、お支払いなどは紹介先の販売店と直接行って頂きますようお願い致します。
              販売店の特定商取引法に基づく表記については、リンク先のサイトをご確認頂きますようお願い致します。
              なお、当サイトで紹介している商品・サービスを利用、使用、ダウンロードするなどの行為に起因して生じる結果に対し、一切の責任を負いません。
            </div>
            <div className="text-lg font-bold pt-2">10. 本ポリシーの変更について</div>
            <div>
              当サイトは、法令の制定、改正などにより、本ポリシーを適宜見直し、予告なく変更する場合があります。
              本ポリシーの変更は、変更後の本ポリシーが当サイトに掲載された時点、またはその他の方法により変更後の本ポリシーが閲覧可能となった時点で有効になります。
            </div>
            <div>以上</div>
          </div>
        </div>
        <div className="text-right text-xs text-gray-500">
          参考: <Link href="https://takapon.net/howto-make-privacy-policy/">takalog</Link>
        </div>
      </div>
    </Container>
  )
}
