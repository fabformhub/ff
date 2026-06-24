export const app = $state({
  form: {
    title: "Untitled form",
    description: "",
    styles: {}
  },

  blocks: [
    {
      id: crypto.randomUUID(),
      type: "ShortText",
      title: "Name",
      description: "",
      styles: {}
    },
    {
      id: crypto.randomUUID(),
      type: "Statement",
      title: "Welcome",
      description: "Thanks for visiting",
      styles: {
        backgroundColor: "#2563eb",
        color: "#ffffff"
      }
    }
  ]
});
