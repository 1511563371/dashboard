<template>
  <v-form class="pa-3" @submit.prevent>
    <v-row>
      <v-col class="pr-8" cols="12" md="6">
        <div class="text-subtitle-1 mb-3">图片</div>

        <v-img v-if="obj.previewUrl" max-width="800" :src="obj.previewUrl" />
        <div v-else class="file__div">
          <div class="kubegems__full-center">
            <v-file-input
              accept="image/*"
              class="ml-5"
              counter
              filled
              flat
              hide-input
              prepend-icon="mdi-file-image"
              show-size
              solo
              @change="onFileChange"
            />
            <div class="text-subtitle-1">上传图片</div>
          </div>
        </div>

        <div class="text-subtitle-1 mb-3">问提</div>
        <ACEEditor
          v-model="obj.question"
          :class="`clear-zoom-${Scale.toString().replaceAll('.', '-')} kubegems__rounded_small`"
          lang="plain_text"
          :options="Object.assign($aceOptions, { readOnly: false, wrap: true })"
          :style="{ height: `200px !important` }"
          theme="chrome"
          @keydown.stop
        />
      </v-col>

      <v-btn class="kubegems__full-center" color="primary" icon :loading="Circular" x-large @click="submitContent">
        <v-icon>mdi-arrow-right-bold </v-icon>
      </v-btn>

      <v-col class="pl-8" cols="12" md="6">
        <div class="text-subtitle-1 mb-3">问答结果</div>
        <pre>{{ rawOut }}</pre>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
  import { mapState } from 'vuex';

  import ParamsMixin from '../../mixins/params';
  import { postModelApi } from '@/api';

  export default {
    name: 'VisualQuestionAnswer',
    mixins: [ParamsMixin],
    props: {
      dialog: {
        type: Boolean,
        default: () => true,
      },
      instance: {
        type: Object,
        default: () => null,
      },
    },
    data: () => {
      return {
        obj: {
          previewUrl: '',
          file: null,
          question: '',
        },
        rawOut: null,
      };
    },
    computed: {
      ...mapState(['Scale', 'Circular']),
    },
    watch: {
      dialog: {
        handler(newValue) {
          if (!newValue) {
            this.obj = this.$options.data().obj;
            this.rawOut = null;
          }
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      onFileChange(e) {
        if (e) {
          this.obj.previewUrl = URL.createObjectURL(e);
          this.obj.file = e;
        } else {
          this.obj.previewUrl = '';
          this.obj.file = null;
        }
        this.rawOut = null;
      },
      async submitContent() {
        if (!this.obj.file) {
          this.$store.commit('SET_SNACKBAR', {
            text: '请上传图片',
            color: 'warning',
          });
          return;
        }
        if (!this.obj.question.trim()) {
          this.$store.commit('SET_SNACKBAR', {
            text: '请输入问题',
            color: 'warning',
          });
          return;
        }

        const _v = this;
        const reader = new FileReader();
        reader.onloadend = async function () {
          const b64data = reader.result.split(',')[1];
          const data = _v.composeInputs(_v.imageParam('iamge', b64data), _v.stringParam('question', _v.obj.question));
          const ret = await postModelApi(_v.instance.environment, _v.instance.name, data);
          _v.rawOut = ret.data.outputs;
        };
        reader.readAsDataURL(this.obj.file);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .file {
    &__div {
      width: 100%;
      height: 600px;
      border: 1.5px solid #efefef;
      border-radius: 3px;
      position: relative;
    }
  }
</style>
