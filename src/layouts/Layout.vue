<!--
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
-->

<template>
  <v-app id="inspire">
    <Header v-model="expandOnHover" :small-title="AdminViewport ? 'header.administrator' : 'header.tenant_workspace'" />
    <v-main :style="`min-height: ${height}px;`">
      <BasePluginPass>
        <template #default>
          <router-view />
        </template>
      </BasePluginPass>
      <Tool v-if="Admin" />

      <Sidebar :key="SidebarKey" :expand-on-hover.sync="expandOnHover" />
    </v-main>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';

  import Header from './header/Header';
  import Sidebar from './sidebar/Sidebar';
  import Tool from './tool/Tool';

  export default {
    name: 'Layout',
    components: {
      Header,
      Sidebar,
      Tool,
    },
    data() {
      return {
        expandOnHover: false,
      };
    },
    computed: {
      ...mapState(['Admin', 'AdminViewport', 'SidebarKey', 'Scale']),
      height() {
        return window.innerHeight / this.Scale;
      },
    },
  };
</script>
