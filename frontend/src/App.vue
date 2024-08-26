<script>
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Copy, ArrowBigRight } from "lucide-vue-next";

export default {
  components: {
    Textarea,
    Button,
    Loader2,
    Copy,
    ScrollArea,
    Separator,
    ArrowBigRight,
  },
  data() {
    return {
      text: "",
      fancyficating: false,
      changed: null,
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
          this.changed = data.changed;
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
  <div class="flex flex-col h-screen">
    <div class="w-screen">
      <h1 class="text-lg font-semibold m-5">Fancyficator</h1>
    </div>
    <Separator class="my-4" />
    <div class="grid m-5 h-full">
      <div class="flex h-full gap-2">
        <div class="flex flex-col w-full gap-2">
          <Textarea
            class="w-full flex flex-grow"
            :disabled="fancyficating ? true : false"
            v-model="text"
            placeholder="Type your text here."
          />
          <div class="w-full flex">
            <Button v-if="!fancyficating" @click="fancyficate()">
              Fancyficate
            </Button>
            <Button v-else disabled>
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Please wait
            </Button>
            <Button
              variant="outline"
              size="icon"
              class="ml-2"
              @click="copyText()"
            >
              <Copy class="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ScrollArea class="w-64 rounded-md border" v-if="changed !== null">
          <div class="p-4">
            <h4 class="mb-4 text-sm font-medium leading-none">Changed</h4>
            <div v-for="word in changed" :key="word.word">
              <div class="text-sm">
                {{ word.synonym }} <ArrowBigRight class="w-4 h-4 inline" />
                {{ word.word }}
              </div>
              <Separator class="my-2" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>
