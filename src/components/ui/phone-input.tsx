import * as React from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface PhoneInputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (!digits.startsWith("7")) return "+7"
  let result = "+7"
  if (digits.length > 1) result += ` (${digits.slice(1, 4)}`
  if (digits.length > 4) result += `) ${digits.slice(4, 7)}`
  if (digits.length > 7) result += `-${digits.slice(7, 9)}`
  if (digits.length > 9) result += `-${digits.slice(9, 11)}`
  return result
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, className, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value
      const formatted = formatPhoneNumber(inputValue)

      // Directly update the input value
      event.target.value = formatted

      // Call the custom onChange if provided
      onChange?.(event)
    }

    return (
      <Input
        type="tel"
        onChange={handleChange}
        placeholder="+7(***) ***-**-**"
        maxLength={18}
        className={cn(
          props["aria-invalid"] && "ring-1 ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
