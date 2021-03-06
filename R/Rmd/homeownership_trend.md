Homeownership trends
================

``` r
library(tidyverse)
library(stringr)
```

Homeownership rates, 1970-2010
------------------------------

This data comes from the NCDB, for which DataHaven has a license. It comes in separate files for each Decennial Census. Data is available by tract. The crosswalk file is a smaller version of what the LEHD puts online, filtered for just New Haven block groups & tracts.

``` r
xwalk <- read_csv("../input/nhv_xwalk.csv")
fips <- unique(xwalk$trct)

years <- seq(1970, 2010, by = 10) %>% as.character()
files <- sprintf("../input/NCDB/%s NCDB CT tracts.csv", years)
ncdb <- files %>% map(read_csv, col_types = cols(.default = "c"))
```

``` r
tenure <- ncdb %>%
  map2_df(years, function(csv, year) {
    y <- str_sub(year, 3, 3)
    cols <- c("TOTHSUN", "OCCHU", "OWNOCC") %>% paste0(., y)
    df <- csv %>% select(GEO2010, one_of(cols)) %>% mutate(year = year)
    names(df)[2:4] <- str_sub(names(df[2:4]), 1, -2)
    return(df)
  }) %>%
  mutate(GEO2010 = paste0("0", GEO2010)) %>%
  setNames(c("name", "tot_households", "occ_households", "owned", "year")) %>%
  filter(name %in% fips) %>%
  select(name, year, everything()) %>%
  mutate_at(3:5, as.numeric)
```

``` r
city <- tenure %>%
  select(-name) %>%
  group_by(year) %>%
  summarise_all(sum) %>%
  mutate(name = "New Haven") %>%
  select(name, everything())

df <- bind_rows(tenure, city) %>%
  mutate(value = owned / occ_households, indicator = "homeownership") %>%
  select(name, indicator, year, value, occ_households)
names(df)[5] <- "raw"
```

``` r
write_csv(df, "../output/homeownership_tract_time.csv")
```
