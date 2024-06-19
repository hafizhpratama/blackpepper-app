import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

export default function Page() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-6 px-4 lg:w-7/12">
        <section className="prose mx-auto">
          <PageHeader>
            <PageHeaderHeading>Privacy Policy</PageHeaderHeading>
            <PageHeaderDescription>
              Last updated: [10 June 2024]
            </PageHeaderDescription>
          </PageHeader>

          <p className="my-5 text-justify">
            This Privacy Policy describes how your personal information is
            collected, used, and shared when you visit or make a purchase from
            our website (the “Site”).
          </p>

          <p className="my-5 text-justify">
            <strong className="block mb-4">
              1. Personal Information We Collect
            </strong>
          </p>
          <p className="my-5 text-justify">
            We collect Device Information using the following technologies:
          </p>
          <ul className="list-disc ml-6">
            <li>Cookies</li>
            <li>Log files</li>
            <li>Web beacons</li>
            <li>Tags and pixels</li>
          </ul>

          <p className="my-5 text-justify">
            <strong className="block mb-4">
              2. How We Use Your Personal Information
            </strong>
          </p>
          <p className="my-5 text-justify">
            We use the Personal Information that we collect to help us screen
            for potential risk and fraud (in particular, your IP address), and
            more generally to improve and optimize our Site (for example, by
            generating analytics about how our customers browse and interact
            with the Site, and to assess the success of our marketing and
            advertising campaigns).
          </p>

          <p className="my-5 text-justify">
            <strong className="block mb-4">
              3. Sharing Your Personal Information
            </strong>
          </p>
          <p className="my-5 text-justify">
            We share your Personal Information with third parties to help us use
            your Personal Information, as described above. For example, we use
            Google Analytics to help us understand how our customers use the
            Site. You can read more about how Google uses your Personal
            Information here: https://www.google.com/intl/en/policies/privacy/.
            You can also opt-out of Google Analytics here:
            https://tools.google.com/dlpage/gaoptout.
          </p>

          <p className="my-5 text-justify">
            <strong className="block mb-4">4. Behavioral Advertising</strong>
          </p>
          <p className="my-5 text-justify">
            As described above, we use your Personal Information to provide you
            with targeted advertisements or marketing communications we believe
            may be of interest to you. For more information about how targeted
            advertising works, you can visit the Network Advertising
            Initiative’s (“NAI”) educational page at
            http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.
          </p>

          <p className="my-5 text-justify">
            <strong className="block mb-4">5. Your Rights</strong>
          </p>
          <p className="my-5 text-justify">
            If you are a European resident, you have the right to access
            personal information we hold about you and to ask that your personal
            information be corrected, updated, or deleted. If you would like to
            exercise this right, please contact us through the contact
            information below.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}
