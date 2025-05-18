export const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="space-y-6 text-gray-700">
        {/* 1. Data Collection */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p>When you use BikeRental.com, we may collect:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Personal Data:</strong> Name, email, phone number, payment
              details
            </li>
            <li>
              <strong>Booking Details:</strong> Rental dates, bike preferences,
              location data
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, device
              information
            </li>
          </ul>
        </section>

        {/* 2. Data Usage */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Data
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process bookings and payments</li>
            <li>Provide customer support</li>
            <li>Improve our services (analytics)</li>
            <li>Send booking confirmations and updates (if opted-in)</li>
          </ul>
        </section>

        {/* 3. Data Protection */}
        <section>
          <h2 className="text-xl font-semibold mb-2">3. Security Measures</h2>
          <p>
            We use SSL encryption for all data transmissions and store payment
            information via PCI-compliant processors (Stripe/PayPal). Regular
            security audits are performed.
          </p>
        </section>

        {/* 4. Third Parties */}
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Third-Party Sharing</h2>
          <p>We only share data with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Payment processors (Stripe/PayPal)</li>
            <li>Bike owners (limited booking details)</li>
            <li>Legal authorities (if required by law)</li>
          </ul>
        </section>

        {/* 5. User Rights */}
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
          <p>You may request to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access or delete your data</li>
            <li>Opt-out of marketing emails</li>
            <li>Correct inaccurate information</li>
          </ul>
          <p className="mt-2">
            Contact us at{" "}
            <a href="mailto:privacy@bikerental.com" className="text-blue-600">
              privacy@bikerental.com
            </a>{" "}
            for requests.
          </p>
        </section>

        {/* 6. Updates */}
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Policy Changes</h2>
          <p>
            Last updated: {new Date().toLocaleDateString()}. We'll notify users
            of significant changes via email or website notices.
          </p>
        </section>
      </div>
    </div>
  );
};
