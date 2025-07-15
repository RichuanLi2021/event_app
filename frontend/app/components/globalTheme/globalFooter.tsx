import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";

export default function GlobalFooter() {
  return (
    <Footer className="fixed bottom-0 left-0 w-full bg-gray-50 border-t border-gray-100 p-0">
      <div className="container mx-auto px-6 flex items-center justify-between h-8">
        {/* remove any default margin, force same font-size */}
        <FooterCopyright 
          href="#" 
          by="GROUP7™" 
          year={2025} 
          className="m-0 text-xs" 
        />
        <FooterLinkGroup className="flex space-x-4 m-0">
          {/* strip their vertical padding too */}
          <FooterLink href="#" className="py-0 text-xs">About</FooterLink>
          <FooterLink href="#" className="py-0 text-xs">Events</FooterLink>
          <FooterLink href="#" className="py-0 text-xs">Contact</FooterLink>
        </FooterLinkGroup>
      </div>
    </Footer>
  );
}