import { AccessLevel, AccessModule } from "@/lib/types";
import { Card } from "@/lib/components/ui/card";
import { useRouter } from "next/navigation";
import { hasAccess, useUser } from "@/lib/context/user-context";

type Props = {
  route: string;
  module: AccessModule;
  level: AccessLevel;
} & React.ComponentProps<"div">

export default function RouteCard({ route, module, level, className, ...rest }: Props) {
  const router = useRouter();
  const context = useUser();

  return (
    <Card
      className={`hover:cursor-pointer ` + className}
      onClick={() => hasAccess(context, module, level) && router.push(route)}
      {...rest}
    >

    </Card>
  );
}