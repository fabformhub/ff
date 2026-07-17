<div class="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white shadow-sm">

    <div class="border-b border-gray-100 p-8">
        <h2 class="text-2xl font-semibold text-gray-900">
            Email Response
        </h2>

        <p class="mt-2 text-sm text-gray-500">
            Automatically send a personalised email after someone submits this form.
        </p>
    </div>

    <div class="space-y-8 p-8">

        <!-- Enable -->

        <div class="flex items-center justify-between rounded-2xl bg-gray-50 p-5">

            <div>

                <h3 class="font-medium text-gray-900">
                    Enable Auto Response
                </h3>

                <p class="mt-1 text-sm text-gray-500">
                    Send an email after every successful submission.
                </p>

            </div>

            <input
                type="checkbox"
                class="h-5 w-5 rounded"
            >

        </div>

        <!-- Recipient -->

        <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
                Recipient Email Field
            </label>

            <select
                class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none">

                <option>Email Address</option>
                <option>Work Email</option>

            </select>

        </div>

        <!-- Subject -->

        <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
                Subject
            </label>

            <input
                class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
                placeholder="Thanks for contacting us!"
            >

        </div>

        <!-- Message -->

        <div>

            <div class="mb-2 flex items-center justify-between">

                <label class="text-sm font-medium text-gray-700">
                    Message
                </label>

                <span class="text-xs text-gray-400">
                    Supports variables
                </span>

            </div>

            <textarea
                rows="12"
                class="w-full rounded-xl border border-gray-300 p-4 font-mono text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="Hi {{first_name}},&#10;&#10;Thanks for contacting us...">
            </textarea>

        </div>

        <!-- Variables -->

        <div>

            <p class="mb-3 text-sm font-medium text-gray-700">
                Variables
            </p>

            <div class="flex flex-wrap gap-2">

                <button class="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                    {{first_name}}
                </button>

                <button class="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                    {{last_name}}
                </button>

                <button class="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                    {{email}}
                </button>

                <button class="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                    {{phone}}
                </button>

            </div>

        </div>

    </div>

    <div class="flex justify-end gap-3 border-t border-gray-100 p-6">

        <button class="rounded-xl border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-50">
            Cancel
        </button>

        <button class="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700">
            Save Settings
        </button>

    </div>

</div>
