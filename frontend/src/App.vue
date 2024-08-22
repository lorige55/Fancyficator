<script>
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-vue-next";

export default {
  components: {
    Textarea,
    Button,
    Loader2,
  },
  data() {
    return {
      text: "",
      fancyficating: false,
    };
  },
  mounted() {
    //
  },
  watch: {
    //
  },
  methods: {
    async fancyficate() {
      this.fancyficating = true;
      await fetch("http://localhost:8001/fancyficate", {
        method: "POST",
        body: JSON.stringify({
          text: this.text,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.text = data.result;
        });
      this.fancyficating = false;
    },
  },
};
</script>

<template>
  <div class="grid h-screen place-items-center">
    <div class="grid w-2/3 gap-2">
      <Textarea
        :disabled="fancyficating ? true : false"
        v-model="text"
        placeholder="Type your text here."
      />
      <Button v-if="!fancyficating" @click="fancyficate()">Fancyficate</Button>
      <Button v-else disabled>
        <Loader2 class="w-4 h-4 mr-2 animate-spin" />
        Please wait
      </Button>
    </div>
  </div>
</template>
