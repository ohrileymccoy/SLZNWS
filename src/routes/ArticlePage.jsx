import { SITE } from '../config/site'
// ...
<Helmet>
  <title>{title} — {SITE.name}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={`${title} — ${SITE.name}`} />
  <meta property="og:url" content={`${SITE.url}/article/${data?.slug}`} />
  {/* ...twitter meta using SITE.twitter... */}
</Helmet>
