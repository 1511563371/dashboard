/*
 * Copyright 2022 The kubegems.io Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Imports
import Vue from 'vue';
import VueI18n from 'vue-i18n';

// Messages
import * as en from 'src/i18n/en.json';
import * as ja from 'src/i18n/ja.json';
import * as zhHans from 'src/i18n/zh-Hans.json';
import * as zhHant from 'src/i18n/zh-Hant.json';
import store from 'src/store';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: store.state.Locale,
  fallbackLocale: store.state.Locale,
  messages: { ['zh-Hans']: zhHans, en, ja, ['zh-Hant']: zhHant },
});

Vue.prototype.$_i18n = i18n;

export default i18n;
