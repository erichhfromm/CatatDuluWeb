<label class="flex items-center justify-between gap-4 cursor-pointer">
    <div><div class="text-sm font-semibold">{{ $title }}</div><div class="text-[11px] text-muted-foreground">{{ $desc }}</div></div>
    <div class="relative"><input type="checkbox" @checked($checked) class="peer sr-only"><div class="w-10 h-6 bg-muted rounded-full peer-checked:bg-primary transition"></div><div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition peer-checked:translate-x-4"></div></div>
</label>
