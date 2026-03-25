import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-indigo-50 to-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8">
          Welcome to Our Ecommerce Store
        </h1>
      </div>

      <div className="relative flex place-items-center mb-12">
        <p className="text-xl text-gray-600 text-center max-w-2xl">
          We offer the best products for your needs. If you have any questions,
          our support team is available via the chat bubble in the bottom right!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass p-6 rounded-2xl flex flex-col items-center">
            <div className="w-full h-48 bg-indigo-100 rounded-xl mb-4 flex items-center justify-center text-4xl">
              🎁
            </div>
            <h3 className="text-xl font-bold mb-2">Awesome Product {i}</h3>
            <p className="text-gray-500 mb-4 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className="btn w-full">Add to Cart</button>
          </div>
        ))}
      </div>

      <ChatWidget />
    </main>
  );
}
