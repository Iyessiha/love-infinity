import { I18nProvider } from '@/components/I18n';
import { getLang } from '@/lib/lang';

/** Layout partagé : fournit la langue aux écrans de l'application. */
export default async function IntlLayout({ children }: { children: React.ReactNode }) {
  return <I18nProvider lang={await getLang()}>{children}</I18nProvider>;
}
