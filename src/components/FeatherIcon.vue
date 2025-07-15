<template>
  <span v-html="iconSvg"></span>
</template>

<script>
import feather from 'feather-icons';

export default {
  name: 'FeatherIcon',
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconSvg() {
      if (feather.icons[this.icon]) {
        return feather.icons[this.icon].toSvg();
      }
      return ''; // or a default icon
    },
  },
};
</script>