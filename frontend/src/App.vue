<script>
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Copy } from "lucide-vue-next";

export default {
  components: {
    Textarea,
    Button,
    Loader2,
    Copy,
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
    copyText() {
      navigator.clipboard.writeText(this.text);
    },
  },
};
</script>

<template>
  <div class="grid h-screen place-items-center">
    <div class="grid w-2/3 gap-2">
      <Textarea
        class="h-64"
        :disabled="fancyficating ? true : false"
        v-model="text"
        placeholder="Type your text here."
      />
      <div class="w-full flex">
        <Button variant="outline" size="icon" class="mr-2" @click="copyText()">
          <Copy class="w-4 h-4" />
        </Button>
        <Button v-if="!fancyficating" @click="fancyficate()" class="w-full"
          >Fancyficate</Button
        >
        <Button v-else disabled class="w-full">
          <Loader2 class="w-4 h-4 mr-2 animate-spin" />
          Please wait
        </Button>
      </div>
    </div>
  </div>
</template>
