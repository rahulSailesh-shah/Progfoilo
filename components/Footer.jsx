import Image from "next/image";
import Link from "next/link";

import { footerLinks } from "../constants";

const FooterColumn = ({ title, links }) => (
  <div className="footer_column">
    <h4 className="font-semibold">{title}</h4>
    <ul className="flex flex-col gap-2 font-normal">
      {links.map((link) => (
        <Link href="/" key={link}>
          {link}
        </Link>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <section className="flexStart footer">
    <div className="flexBetween footer_copyright">
      <p>@ 2023 Progfolio. All rights reserved</p>
    </div>
  </section>
);

export default Footer;
