import { useEffect, useState } from "react"

export default function useDelayedTrue(delay = 500) {
    const [value, setValue] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setValue(true)
        }, delay)

        return () => clearTimeout(timer)
    }, [delay])

    return value
}
