<script>
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default {
  components: {
    Textarea,
    Button,
  },
  data() {
    return {
      text: "",
    };
  },
  mounted() {
    //
  },
  watch: {
    //
  },
  methods: {
    //
  },
};
</script>

<template>
  <div class="grid h-screen place-items-center">
    <div class="grid w-full gap-2 w-2/3">
      <Textarea v-model="text" placeholder="Type your text here." />
      <Button>Fancyficate</Button>
    </div>
  </div>
</template>
