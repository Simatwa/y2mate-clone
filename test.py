from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from time import sleep

driver = webdriver.Firefox()
from bs4 import BeautifulSoup


def soupify(html: str):
    return BeautifulSoup(html, "html.parser")


def save_page(name: str):
    """Save current page to a .html file"""
    page_contents = driver.page_source
    with open("scraped/" + name + ".html", "w") as fh:
        fh.write(soupify(page_contents).prettify())


def main():
    driver.get("https://y2mate.com")
    print("Sleeping for 30s")
    sleep(30)
    save_page("home")
    # search_element = driver.find_element(By.XPATH, '//input[@name="query"]')
    # search_element.send_keys("alan walker songs")
    # search_element.send_keys(Keys.ENTER)
    driver.get("https://www.y2mate.com/search/alan%20walker%20songs")
    print("Sleeping for 30s")
    sleep(30)
    save_page("search-results")
    driver.get("https://www.y2mate.com/youtube/60ItHLz5WEA")
    sleep(30)
    save_page("download-page")
    driver.quit()


if __name__ == "__main__":
    main()
