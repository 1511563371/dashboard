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
  <ACEEditor
    v-model="values"
    :class="`clear-zoom-${Scale.toString().replaceAll('.', '-')} rounded`"
    lang="yaml"
    :options="Object.assign($aceOptions, { readOnly: false, wrap: true })"
    :style="{ height: `${height}px !important` }"
    theme="chrome"
    @init="$aceinit"
    @keydown.stop
  />
</template>

<script>
  import { mapState } from 'vuex';

  import { deepCopy } from '@/utils/helpers';

  export default {
    name: 'ValuesForm',
    props: {
      item: {
        type: Object,
        default: () => null,
      },
    },
    data() {
      return {
        values: '',
        obj: {},
      };
    },
    computed: {
      ...mapState(['Scale']),
      height() {
        return (window.innerHeight - 202) / this.Scale;
      },
    },
    watch: {
      item: {
        handler(newValue) {
          if (newValue) {
            this.values = this.$yamldump(newValue.values);
            this.obj = deepCopy(newValue);
          }
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      validate() {
        return true;
      },
      getData() {
        this.obj.values = deepCopy(this.$yamlload(this.values)) || {};
        return this.obj;
      },
    },
  };
</script>
