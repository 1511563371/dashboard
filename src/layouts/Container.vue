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
  <div>
    <v-system-bar
      v-if="Broadcast.length > 0"
      class="white--text text-subtitle-1 font-weight-medium mx-3 rounded-b"
      color="orange lighten-2"
      height="48"
    >
      <div class="text-start notice">
        <span v-for="(item, index) in Broadcast" :key="index" class="px-1">
          <v-icon color="white">mdi-volume-high</v-icon>
          <span class="ml-2" v-html="parseLink(item.message)" />
        </span>
      </div>
    </v-system-bar>
    <router-view />
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'Container',
    computed: {
      ...mapState(['Broadcast']),
    },
    mounted() {
      this.$nextTick(() => {
        this.$store.dispatch('INIT_BROADCAST');
      });
    },
    methods: {
      parseLink(message) {
        const reg = new RegExp('(https?[\\/:\\.\\-_&\\?\\w=]*)', 'g');
        return message.replaceAll(
          reg,
          `<a href="$1" target="_blank" style="text-decoration: underline;color: white;">$1</a>`,
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .notice {
    width: 100%;
  }
</style>
