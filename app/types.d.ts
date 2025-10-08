import 'styled-components/native';

import type {FlyingMonkeysTheme} from '@/theme';

declare module 'styled-components/native' {
  interface DefaultTheme extends FlyingMonkeysTheme {}
}
