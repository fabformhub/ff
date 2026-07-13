<script>
  import { supabase } from '$lib/supabaseClient';
  let sending = $state(false);
  let result = $state(null);

  async function sendEmail(id) {
    sending = true;
    result = null;
    id = "4a14f481-7273-4ffb-9f44-4587b7ff1efd";

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        uid: id,
        subject: 'Testing 123',
        html: '<p>Hello World!</p>',
      },
    });

    if (error) {
      console.log('error:', error);
      let detailedMessage = error.message;

      if (error.context) {
        try {
          const bodyText = await error.context.text();
          console.log('response body:', bodyText);
          detailedMessage = bodyText;
        } catch (e) {
          console.log('could not read error context:', e);
        }
      }

      result = `Error: ${detailedMessage}`;
    } else {
      result = 'Email sent!';
    }

    sending = false;
  }
</script>

<button onclick={sendEmail} disabled={sending}>
  {sending ? 'Sending…' : 'Send Email'}
</button>
{#if result}
  <p>{result}</p>
{/if}
