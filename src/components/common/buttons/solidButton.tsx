import { Button } from "../../ui/button";
import {Text} from "../../ui/text";

interface SolidButtonProps {
    children?: React.ReactNode;
    text?: string;
    }

function SolidButton({ text }: SolidButtonProps) {
  return (
    <Button variant="solid" action="primary" >
          <Text size="smButton" type="whiteText">{text}</Text>
        </Button>
  );
}

export default SolidButton;