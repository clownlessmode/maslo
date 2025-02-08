import { CommandGroup, CommandItem, CommandList, CommandInput } from "./command"
import { Command as CommandPrimitive } from "cmdk"
import {
  useState,
  useRef,
  useCallback,
  useMemo,
  type KeyboardEvent,
} from "react"

import { Skeleton } from "./skeleton"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type Option = Record<"value" | "label", string> & Record<string, string>

type AutoCompleteProps = {
  options: Option[]
  emptyMessage: string
  value?: string // Changed from Option to string
  onValueChange?: (value: string) => void // Changed from Option to string
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
}

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setOpen] = useState(false)

  // Find the selected option based on value
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  )

  const [inputValue, setInputValue] = useState<string>(
    selectedOption?.label || ""
  )

  const filteredOptions = useMemo(() => {
    if (inputValue.trim() === "") {
      return options.slice(0, 10)
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  }, [inputValue, options])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) return

      if (!isOpen) setOpen(true)

      if (event.key === "Enter" && input.value.trim() !== "") {
        const optionToSelect = options.find(
          (option) => option.label.toLowerCase() === input.value.toLowerCase()
        )
        if (optionToSelect) {
          handleSelectOption(optionToSelect)
        }
      }

      if (event.key === "Escape") {
        input.blur()
      }
    },
    [isOpen, options]
  )

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label)
      onValueChange?.(selectedOption.value)
      setTimeout(() => {
        inputRef.current?.blur()
      }, 0)
    },
    [onValueChange]
  )

  const handleBlur = useCallback(() => {
    setOpen(false)
    setInputValue(selectedOption?.label || "")
  }, [selectedOption])

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={!isLoading ? setInputValue : undefined}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex h-[50px] sm:h-[69px] w-full text-lg sm:text-2xl uppercase rounded-[15px] sm:rounded-[20px] bg-background-100 px-[20px] sm:px-[50px] font-normal py-3 sm:py-5",
            "file:border-0 file:bg-transparent file:text-xs sm:file:text-sm file:font-medium file:text-zinc-950",
            "placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#767676]",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-[20px] bg-background-100 outline-none",
            isOpen ? "block" : "hidden"
          )}
        >
          <CommandList className="rounded-[20px] ring-1 ring-[#767676]">
            {isLoading && (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            )}
            {!isLoading && filteredOptions.length > 0 && (
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = value === option.value
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "flex w-full items-center gap-2 px-[50px] py-6 text-2xl uppercase text-white",
                        "hover:bg-white/20 cursor-pointer rounded-md",
                        !isSelected ? "pl-[70px]" : ""
                      )}
                    >
                      {isSelected && <Check className="w-4" />}
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
            {!isLoading && filteredOptions.length === 0 && (
              <CommandPrimitive.Empty className="select-none px-[50px] py-4 text-2xl uppercase text-white/40">
                {emptyMessage}
              </CommandPrimitive.Empty>
            )}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  )
}
