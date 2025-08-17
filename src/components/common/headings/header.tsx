import {Text} from "../../ui/text";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <>
      <Text size="xl" type="blackText" >{title}</Text>
      <Text size="sm" type="blackText">
        {description}
      </Text>
    </>
  );
}

export default Header;