<script>
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    Label,
    Switch,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  },
  data() {
    return {
      text: "",
      fancyficating: false,
      changed: null,
      vocabulary: true,
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
          vocabulary: this.vocabulary,
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
    <Separator />
    <div class="grid m-5 h-full">
      <div class="flex h-full gap-2">
        <div class="flex flex-col w-full gap-2">
          <Textarea
            class="w-full flex flex-grow mb-2"
            :disabled="fancyficating ? true : false"
            v-model="text"
            placeholder="Type your text here."
          />
          <div class="w-full flex">
            <Button
              class="shadow-sm"
              v-if="!fancyficating"
              @click="fancyficate()"
            >
              Fancyficate
            </Button>
            <Button class="shadow-sm" v-else disabled>
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Please wait
            </Button>
            <Button
              variant="outline"
              size="icon"
              class="ml-2 shadow-sm"
              @click="copyText()"
            >
              <Copy class="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div class="w-96">
          <h4 class="ml-4 text-sm font-medium leading-none">Settings</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div class="p-4 flex items-center space-x-2">
                  <Switch
                    :checked="vocabulary"
                    @click="vocabulary = !vocabulary"
                    id="vocab"
                  />
                  <Label for="vocab">Replace Vocabulary</Label>
                </div></TooltipTrigger
              >
              <TooltipContent class="w-64">
                <p>
                  <i>Fancyficate</i> your text with overly posh vocabulary.
                  Wouldn't use it for a real, grades essay for school...
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ScrollArea class="w-full">
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
  </div>
</template>
