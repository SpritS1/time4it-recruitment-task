import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const UserAvatar = () => {
  return (
    <figure className="group flex min-w-0 flex-1 items-center gap-4">
      <Avatar className="size-14 outline-avatar-contrast-border outline-1 -outline-offset-1">
        <AvatarImage src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" />
        <AvatarFallback>OR</AvatarFallback>
      </Avatar>

      <figcaption className="min-w-0 flex-1">
        <p className="text-primary text-lg font-semibold">
          Witaj ponownie, Olivia
        </p>
        <span className="truncate text-tertiary text-md">
          {new Date().toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </figcaption>
    </figure>
  );
};
