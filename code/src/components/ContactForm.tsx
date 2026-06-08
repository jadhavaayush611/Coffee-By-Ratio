import React, { useState, useEffect } from 'react';

const ContactForm = () => {
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subject, setSubject] = useState<string>("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sub = params.get('subject');
      if (sub) {
        setSubject(sub);
      }
    }
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setResult("Sending....");
    
    const formData = new FormData(event.currentTarget);

    // Web3Forms Access Key - Replace with your own key from https://web3forms.com/
    formData.append("access_key", "74576d6e-2f5e-42a2-9ae6-cb0a92c05a67");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setStatus("success");
      setResult("Message sent successfully.");
      (event.target as HTMLFormElement).reset();
    } else {
      console.log("Error", data);
      setStatus("error");
      setResult(data.message || "Unable to send message.");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Honeypot Spam Protection */}
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="name" className="text-sm font-bold text-foreground uppercase tracking-wider">
              Name <span className="text-error">*</span>
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              className="w-full h-12 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
              placeholder="Your Name" 
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="email" className="text-sm font-bold text-foreground uppercase tracking-wider">
              Email <span className="text-error">*</span>
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="w-full h-12 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
              placeholder="your@email.com" 
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <label htmlFor="subject" className="text-sm font-bold text-foreground uppercase tracking-wider">
            Subject <span className="text-error">*</span>
          </label>
          <input 
            type="text" 
            id="subject" 
            name="subject" 
            required 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-12 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
            placeholder="How can we help?" 
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="message" className="text-sm font-bold text-foreground uppercase tracking-wider">
            Message <span className="text-error">*</span>
          </label>
          <textarea 
            id="message" 
            name="message" 
            required 
            rows={5} 
            className="w-full p-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
            placeholder="Your message..."
          ></textarea>
        </div>

        <div className="flex flex-col space-y-4">
          <button 
            type="submit" 
            disabled={status === "loading"}
            className={`px-10 py-4 bg-primary text-on-primary font-bold rounded-xl transition-all shadow-lg flex items-center justify-center min-w-[160px] ${status === "loading" ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]"}`}
          >
            {status === "loading" ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : "Send Message"}
          </button>

          <div 
            aria-live="polite" 
            className={`text-sm font-medium transition-all duration-300 ${status === "success" ? "text-success" : status === "error" ? "text-error" : "opacity-0"}`}
          >
            {result}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
